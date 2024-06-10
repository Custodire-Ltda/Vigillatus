{ pkgs ? import <nixpkgs> {} }: # nixpkgs 23.11
pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    mysql80
  ];

  shellHook = ''
    mkdir ./temp_mysql
    mkdir ./temp_mysql/data
    mkdir ./temp_mysql/mysql_socket

    mysqld --initialize-insecure --console --datadir="$PWD/temp_mysql/data" --user="$WHOAMI" 

    mysqld --datadir="$PWD/temp_mysql/data" --socket="$PWD/temp_mysql/mysql_socket/mysql.sock"
  '';

  # use mysql.sock in another terminal with mysql80:
  # mysql -u seu_usuario -p -S your/path/mysql_sockets/mysql.sock
}
