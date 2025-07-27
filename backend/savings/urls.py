from django.urls import include, path
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)

urlpatterns = [
    path("api", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("list/", views.get_saving, name="get_saving"),
    path("save/", views.save_saving, name="save_saving"),
    path("delete/<int:id>/", views.delete_saving, name="delete_saving"),
    path("expense/list/", views.get_expense, name="get_expense"),
    path("expense/save/", views.save_expense, name="save_expense"),
    path("expense/delete/<int:id>/", views.delete_expense, name="delete_expense"),
    path("credit/list/", views.get_credit, name="get_credit"),
    path("credit/save/", views.save_credit, name="save_credit"),
    path("credit/delete/<int:id>/", views.delete_credit, name="delete_credit"),
    path("summary/", views.summary, name="summary"),
    path(
        "particular-options/",
        views.particular_options_api,
        name="particular_options_api",
    ),
    path("expense-pivot/", views.expense_pivot, name="expense_pivot"),
]
