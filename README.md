# RendezView
Akshaya Kumar, Tao Sun, Visa Thongdee, Sujal Timilsina, Vidya Vuppala 

To install the necessary python packages, you can run 
`pip install -r requirements.txt` from the server folder

## login
We are using [flask-jwt-extended](https://flask-jwt-extended.readthedocs.io/en/stable/basic_usage.html) for logging in
it creates a token for the user and stores it in the session
If you need a `current user` for a method, use the `jwt_required()` decoration in you flask api function
- In the front end, you need to add the current token as a header in your http request, which you can do like this
  `"Authorization: Bearer " + sessionStorage.getItem("token")`
You can also look at login.js, username.js and register.js and its respective flask api calls for reference

Note that session storage only works for the current session. If you close the tab or duplicate it, the session storage is reset 

## [database version control](https://flask-migrate.readthedocs.io/en/latest/)
- ` pip install Flask-Migrate `
- to migrate (or commit) do 
`flask --app app.py db migrate`
- to upgrade (or push) do
`flask --app app.py db upgrade` 
