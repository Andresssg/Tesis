import multiprocessing

command = 'home/tesisuser/miniconda3/envs/py39/bin/gunicorn'
pythonpath = '/home/tesisuser/Tesis/Backend/tesis_project'
bind = '127.0.0.1:8000'
workers = multiprocessing.cpu_count() * 2 + 1
timeout = 1000
errorlog = '/var/log/gunicorn/backendtesis.log'