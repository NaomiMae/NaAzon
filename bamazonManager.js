var mysql = require("mysql");
require("console.table");
var inquirer = require("inquirer");
require("dotenv").config();
var sum;
// create the connection information for the sql database
// var mySql = process.env.password;
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "SigmaLG#16",
    database: "bamazon_db",

});

connection.connect(function (err, ) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    whatToDo();

});

var whatToDo = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        
        inquirer.prompt([{

            name: "toDo",
            type: "list",
            message: "What do you want to do?: \n",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        },

        ])
            .then(function (answer) {
                if (answer.toDo === "View Products for Sale") {
                    console.table(res);
                    viewProducts();
                }

                if (answer.toDo === "View Low Inventory") {
                    console.table(res);
                    lowInventory();
                }

                if (answer.toDo === "Add to Inventory") {
                    console.table(res);
                    addInventory();
                }

                if (answer.toDo === "Add New Product") {
                    console.table(res);
                    addProduct();
                }
            });




    })

    function viewProducts() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // console.table(res);
            whatToDo();

        })

    }

    function lowInventory() {
        connection.query("SELECT * FROM products WHERE stock_quantity < 20 ", function (err, res) {
            if (err) throw err;
            console.table(res);
            whatToDo();

        })




    }
function addInventory(){
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        // console.table(res);
     inquirer.prompt([{
        name: "product",
        type: "input",
        message: "Which product ID would you like to add to? \n",

     },
     {
        name: "quantity",
        type: "input",
        message: "How much of this product?: \n",
    }
    ])
    .then(function (answer) {

        if (res[(answer.product - 1)].stock_quantity > answer.quantity) {
            // sum = res[(answer.product - 1)].price * answer.quantity;

            // console.log("do you see me");

            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: res[(answer.product - 1)].stock_quantity + parseInt(answer.quantity)
                    },
                    {
                        id: answer.product
                    },
                ],
                
                // function (err) {
                //     if (err) throw err;
                //     console.log("_______________________________________________________________");
                //     console.log("This is how much it is $" + sum + " Thank you for your purchase!");
                //     console.log("_______________________________________________________________");
                // }
            );
        } 
        console.table(res);
        whatToDo();
    //    getProducts();  
    });


    

    }
    )
    
}

function addProduct(){
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        // console.table(res);
     inquirer.prompt([{
        name: "product",
        type: "input",
        message: "Which product would you like to add?: \n",

     },
     {
        name: "department",
        type: "input",
        message: "Which Department is this product going?: \n",
    },
    {
        name: "price",
        type: "input",
        message: "How much does this product cost?: \n",
    },
    {
        name: "quantity",
        type: "input",
        message: "How much of this product?: \n",
    }
    ])
    .then(function (answers) {

      

            connection.query(
                "INSERT INTO products SET ?",
               {
                product_name: answers.product,
                department_name: answers.department,
                price: answers.price,
                stock_quantity : answers.quantity,
               }
                // function (err) {
                //     if (err) throw err;
                //     console.log("_______________________________________________________________");
                //     console.log("This is how much it is $" + sum + " Thank you for your purchase!");
                //     console.log("_______________________________________________________________");
                // }
            );
            console.table(res);
        whatToDo();
        
    //    getProducts();  
    });


    

    }
    )
    
}



}

