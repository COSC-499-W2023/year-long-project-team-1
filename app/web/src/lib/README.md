# Lib Folder

Used to store other common scripts that are not `.tsx` components or API routes. e.g. string manipulations, date formatting, etc.

## Config

`config.ts` contains utilities for loading configuration files.

Configuration files are stored in the `./conf` folder and are loaded using the `extractConfigFile` function.

During development, set the `PRIVACYPAL_CONFIG_DIR` environment variable to the path of the `conf/` folder. An easy shorthand is `${PWD}/conf`. If this veriable is not specified, the default value is `/opt/conf`, a known location in the container environment.

## Auth

`auth.ts` contains utilities for authenticating users.

Setting the `PRIVACYPAL_AUTH_MANAGER` environment variable to `basic` will enable basic authentication. This is the default value. Accepted values are currently:

-   `basic`: Basic authentication using a `user.properties.json` file.
