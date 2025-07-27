


from rest_framework import status


from django.http import HttpResponse
from django.contrib.auth.models import Group, User
from .models import Saving, Expense, Credit
from rest_framework import permissions, viewsets
from . import serializers
from .serializers import (
    UserSerializer,
    SavingSerializer,
    ExpenseSerializer,
    CreditSerializer,
)
from .models import ParticularOption
from .serializers import ParticularOptionSerializer
# API to get particular options by type
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(["GET"])
@permission_classes([AllowAny])
def get_saving(request):
    saving = Saving.objects.all()
    serializer = SavingSerializer(saving, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def save_saving(request):
    payload = request.data.copy()

    # Map frontend keys to model fields
    if "Particular" in payload:
        payload["particular"] = payload.pop("Particular")
    if "Amount" in payload:
        payload["amount"] = payload.pop("Amount")

    saving_id = payload.get("id")

    # If an id is provided, try to update the existing Saving
    if saving_id:
        try:
            saving = Saving.objects.get(id=saving_id)
        except Saving.DoesNotExist:
            saving = None
        if saving:
            serializer = SavingSerializer(saving, data=payload, partial=True)
            if serializer.is_valid():
                saving = serializer.save()
                return Response(SavingSerializer(saving).data)
            else:
                return Response(serializer.errors, status=400)

    # Otherwise, create a new Saving
    serializer = SavingSerializer(data=payload)
    if serializer.is_valid():
        saving = serializer.save()
        return Response(SavingSerializer(saving).data)
    else:
        return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_saving(request, id):
    try:
        saving = Saving.objects.get(id=id)
        saving.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)
    except Saving.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


# Expense Endpoints
@api_view(["GET"])
@permission_classes([AllowAny])
def get_expense(request):
    expense = Expense.objects.all()
    serializer = ExpenseSerializer(expense, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def save_expense(request):
    payload = request.data.copy()

    # Map frontend keys to model fields
    if "Particular" in payload:
        payload["particular"] = payload.pop("Particular")
    if "Amount" in payload:
        payload["amount"] = payload.pop("Amount")

    expense_id = payload.get("id")

    # If an id is provided, try to update the existing Expense
    if expense_id:
        try:
            expense = Expense.objects.get(id=expense_id)
        except Expense.DoesNotExist:
            expense = None
        if expense:
            serializer = ExpenseSerializer(expense, data=payload, partial=True)
            if serializer.is_valid():
                expense = serializer.save()
                return Response(ExpenseSerializer(expense).data)
            else:
                return Response(serializer.errors, status=400)

    # Otherwise, create a new Expense
    serializer = ExpenseSerializer(data=payload)
    if serializer.is_valid():
        expense = serializer.save()
        return Response(ExpenseSerializer(expense).data)
    else:
        return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_expense(request, id):
    try:
        expense = Expense.objects.get(id=id)
        expense.delete()
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)
    except Expense.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)


# CREDIT API
@api_view(["GET"])
@permission_classes([AllowAny])
def get_credit(request):
    credit = Credit.objects.all()
    serializer = CreditSerializer(credit, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def save_credit(request):
    payload = request.data.copy()
    if "Particular" in payload:
        payload["particular"] = payload.pop("Particular")
    if "Amount" in payload:
        payload["amount"] = payload.pop("Amount")
    credit_id = payload.get("id")
    if credit_id:
        try:
            credit = Credit.objects.get(id=credit_id)
        except Credit.DoesNotExist:
            credit = None
        if credit:
            serializer = CreditSerializer(credit, data=payload, partial=True)
            if serializer.is_valid():
                credit = serializer.save()
                return Response(CreditSerializer(credit).data)
            else:
                return Response(serializer.errors, status=400)
    serializer = CreditSerializer(data=payload)
    if serializer.is_valid():
        credit = serializer.save()
        return Response(CreditSerializer(credit).data)
    else:
        return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_credit(request, id):
    try:
        credit = Credit.objects.get(id=id)
        credit.delete()
        return Response({"success": True})
    except Credit.DoesNotExist:
        return Response({"error": "Credit not found"}, status=404)

from django.db.models.functions import TruncMonth
from django.db.models import Sum

# Monthly summary endpoint
@api_view(["GET"])
@permission_classes([AllowAny])
def summary(request):
    # Get all months present in any of the three tables
    savings = Saving.objects.all()
    expenses = Expense.objects.all()
    credits = Credit.objects.all()

    # Optional month filter (YYYY-MM)
    month_param = request.GET.get('month')

    # Get all unique months (YYYY-MM) from all tables
    months = set()
    for obj in list(savings) + list(expenses) + list(credits):
        if obj.date:
            months.add(obj.date.strftime("%Y-%m"))
    months = sorted(months)

    # If month param is provided, always return that month (even if no data)
    if month_param:
        months = [month_param]
        # If there is no data for this month, still calculate balances for it
        # (so the frontend always gets a row)

    from datetime import datetime, timedelta
    result = []
    for month in months:
        # Parse month to get first and last day
        year, m = map(int, month.split('-'))
        first_day = datetime(year, m, 1)
        if m == 12:
            next_month = datetime(year + 1, 1, 1)
        else:
            next_month = datetime(year, m + 1, 1)
        last_day = next_month - timedelta(days=1)

        # Opening balance: net balance up to the day before this month
        s_open = savings.filter(date__lt=first_day).aggregate(total=Sum('amount'))['total'] or 0
        e_open = expenses.filter(date__lt=first_day).aggregate(total=Sum('amount'))['total'] or 0
        c_open = credits.filter(date__lt=first_day).aggregate(total=Sum('amount'))['total'] or 0
        opening_balance = (s_open + c_open) - e_open

        # Closing balance: net balance up to the last day of this month
        s_close = savings.filter(date__lte=last_day).aggregate(total=Sum('amount'))['total'] or 0
        e_close = expenses.filter(date__lte=last_day).aggregate(total=Sum('amount'))['total'] or 0
        c_close = credits.filter(date__lte=last_day).aggregate(total=Sum('amount'))['total'] or 0
        closing_balance = (s_close + c_close) - e_close

        # This month's totals
        s_total = savings.filter(date__startswith=month).aggregate(total=Sum('amount'))['total'] or 0
        e_total = expenses.filter(date__startswith=month).aggregate(total=Sum('amount'))['total'] or 0
        c_total = credits.filter(date__startswith=month).aggregate(total=Sum('amount'))['total'] or 0
        net = (s_total + c_total) - e_total

        result.append({
            'month': month,
            'savings': s_total,
            'expenses': e_total,
            'credit': c_total,
            'net_balance': net,
            'opening_balance': opening_balance,
            'closing_balance': closing_balance
        })
    return Response(result)


@api_view(["GET", "POST", "PUT", "PATCH", "DELETE"])
@permission_classes([AllowAny])
def particular_options_api(request):
    if request.method == "GET":
        type_param = request.GET.get('type')
        qs = ParticularOption.objects.all()
        if type_param in dict(ParticularOption.TYPE_CHOICES):
            qs = qs.filter(type=type_param)
        serializer = ParticularOptionSerializer(qs, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = ParticularOptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method in ["PUT", "PATCH"]:
        pk = request.data.get("id")
        try:
            obj = ParticularOption.objects.get(pk=pk)
        except ParticularOption.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ParticularOptionSerializer(obj, data=request.data, partial=(request.method=="PATCH"))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        pk = request.data.get("id")
        try:
            obj = ParticularOption.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ParticularOption.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        
from django.db.models import Sum

# API endpoint for monthly expense pivot (sum per particular for a given month)
@api_view(["GET"])
@permission_classes([AllowAny])
def expense_pivot(request):
    month = request.GET.get('month')
    if not month:
        return Response({"error": "month parameter required"}, status=400)
    # Only consider expenses with a valid date and valid particular in the given month (YYYY-MM)
    # Only exclude null dates (do not exclude empty string, which is invalid for DateField)
    qs = Expense.objects.filter(date__startswith=month).exclude(date__isnull=True)
    # Group by particular and sum amount
    data = (
        qs.values('particular')
        .annotate(total=Sum('amount'))
        .order_by('particular')
    )
    # Return as {particular: total, ...}
    result = {row['particular']: row['total'] or 0 for row in data }
    return Response(result)