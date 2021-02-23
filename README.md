# Firebase Query Studio

A simple yet powerful application to query Firebase data.

## Functionality

* Allows to read collections and documents
* Filter collections on multiple fields!
* Easy to setup

## Setup 

* Clone this repo
* Get Firebase config file from `Project Settings > General > Web App > Firebase SDK snippet > Config`
* Paste its content in `config.ts`, just make sure that there is a `export default firebaseConfig;` at the end of the file, like it is in the [example file](./src/config.example.ts).

## Current Limitations

* Subcollections are not supported
* It is not possible to edit/add/remove data
* Since Firestore client libraries do not allow to list existing collections, collection names must be added manually (this is saved in local storage for convenience :smile: )
* Config file can only be retrieved if there is a web project configured in Firebase

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
