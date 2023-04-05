# Host web application with raspberry-pi

1. Install net-tools

    ````bash
    sudo apt install net-tools
    ````

    ````bash
    ifconfig
    ````

2. Install nvm by running install script

    Visit <https://github.com/nvm-sh/nvm>

    ````bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    ````

    ````bash
    echo 'export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> ~/.bashrc 
    ````

    ````bash
    source ~/.bashrc
    ````

    ````bash
    command -v nvm
    ````

3. Install node

    Visit <https://github.com/nvm-sh/nvm>

    ````bash
    nvm ls-remote
    ````

     ````bash
    nvm install node 18.15.0
    ````

4. Create react app

    ````bash
    mkdir web-app
    ````

    ````bash
    npm init
    ````
