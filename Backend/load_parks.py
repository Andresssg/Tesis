import mysql.connector
import json
from decouple import config
import os

# Obtener variables de entorno
db_host = config('DATABASE_HOST')
db_user = config('DATABASE_USER')
db_password = config('DATABASE_PASSWORD')
db_name = config('DATABASE_SECOND_NAME')

# Conexión a la base de datos MySQL
db_connection = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name
)

# Lectura del archivo JSON
file_path = os.path.join(os.getcwd(),'parks.json')

with open(file_path, encoding='utf-8') as json_file:
    parks = json.load(json_file)

# Query para insertar datos en la base de datos
insert_query = "INSERT INTO parks (code, name, scale, address, locality) VALUES (%s, %s, %s, %s, %s)"

# Query para verificar si los datos ya existen en la base de datos
check_query = "SELECT * FROM parks WHERE code = %s AND name = %s AND scale = %s AND address = %s AND locality = %s"

# Cursor para ejecutar consultas SQL
cursor = db_connection.cursor()

# Iterar sobre los datos y ejecutar la inserción
for item in parks:
    values = (item['code'], item['name'], item['scale'], item['address'], item['locality'])
    
    cursor.execute(check_query, values)
    existing_data = cursor.fetchone()
    
    if not existing_data:  # Si los datos no existen, realizar la inserción
        cursor.execute(insert_query, values)

# Confirmar los cambios y cerrar la conexión
db_connection.commit()
cursor.close()
db_connection.close()
print("Datos de los parques cargados exitosamente")
