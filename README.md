# Firebase Query Studio

A simple yet powerful application to query Firebase data.

## Why is this better than Firebase UI?

* It allows to easily run queries on your collections, for example:

```
firestore.collection('User').where('is_guest','==',true).where('is_disabled','==',false).limit(1).get();
```

* If writing queries is not your thing, you can use filter controls to easily filter collections on multiple fields

## Run this project

* Get Firebase config file from `Project Settings > General > Web App > Firebase SDK snippet > Config`
* Paste its content in `config.example.ts`, just make sure that there is a `export default firebaseConfig;` at the end of the file, like it is in the example file.

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
