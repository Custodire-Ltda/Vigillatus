{ pkgs ? import <nixpkgs> {} }: # nixpkgs 23.11
pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    mysql80
  ];

  shellHook = ''
    mkdir ./data
    mkdir ./mysql_socket

    mysqld --initialize-insecure --console --datadir="$PWD/data" --user="$WHOAMI" 

    mysqld --datadir="$PWD/data" --socket="$PWD/mysql_socket/mysql.sock"
  '';

  # use mysql.sock in another terminal with mysql80:
  # mysql -u seu_usuario -p -S your/path/mysql_sockets/mysql.sock
}
