"""Check connectivity to a configured MySQL database."""

import getpass
import os

import mysql.connector


def main():
    user = os.environ.get("MYSQL_USER")
    database = os.environ.get("MYSQL_DATABASE")
    socket = os.environ.get("MYSQL_SOCKET")

    if not all((user, database, socket)):
        print("Missing MYSQL_USER, MYSQL_DATABASE, or MYSQL_SOCKET.")
        return

    password = getpass.getpass("Database password: ")

    connection = mysql.connector.connect(
        user=user,
        password=password,
        unix_socket=socket,
        database=database,
    )

    try:
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT VERSION(), DATABASE(), CURRENT_USER(), @@port")
            version, connected_database, connected_user, port = cursor.fetchone()

            print("Database connection successful!")
            print(f"MySQL version: {version}")
            print(f"Database: {connected_database}")
            print(f"User: {connected_user}")
            print(f"Port: {port}")
        finally:
            cursor.close()
    finally:
        connection.close()


if __name__ == "__main__":
    main()
