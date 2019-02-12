var mysql = require("mysql");
require("console.table");
var inquirer = require("inquirer");
require("dotenv").config();
var sum;
// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.PASSWORD,
    database: "bamazon_db"
});

connection.connect(function (err, ) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    getProducts();  

});
function getProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        pickProducts();
    })

}
var pickProducts = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
    inquirer.prompt([{
        
        name: "product",
        // part two change this to menu
        type: "input",
        message: "Pick a product ID: \n",
        // part two add
    },
    {
        name: "quantity",
        type: "input",
        message: "How much of this product?: \n",
    }

    ])
        .then(function (answer) {
            if (res[(answer.product - 1)].stock_quantity > answer.quantity) {
                sum = res[(answer.product - 1)].price * answer.quantity;


                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[(answer.product - 1)].stock_quantity - answer.quantity
                        },
                        {
                            id: answer.product
                        },
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("_______________________________________________________________");
                        console.log("This is how much it is $" + sum + " Thank you for your purchase!");
                        console.log("_______________________________________________________________");
                    }
                );
            } else { 
                console.log("_______________________________________________________________");
                console.log("Sorry we don't have that much of product");
                console.log("_______________________________________________________________");
             }
           getProducts();  
        });
    })
}





// connection.end();

