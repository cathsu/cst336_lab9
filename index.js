/* Require external APIs and start our application instance */
var express = require('express');
var mysql = require('mysql');
var app = express();

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    host: 'ac13p04qck3oipad@un0jueuv2mam78uv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'o81c78k2qfme9lwj',
    password: 'ac13p04qck3oipad',
    database: 'pu3efiquen3026ei', 
    multipleStatements: true
});

connection.connect();

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    var stmtCategory = 'select distinct category from l9_quotes';
    var stmtAuthor = 'select distinct firstName, lastName from l9_author';
    
    var queries = stmtCategory + ';' + stmtAuthor
    connection.query(queries, function(error, found) {
        var categories = null; 
        var authors = null; 
        if (error) throw error; 
        if (found.length) {
            categories = found[0]; 
            authors = found[1]; 
        }
        res.render('home', {categories: categories, authors: authors});
    }); 
    
    
});

app.get('/quotes', function(req, res) {
    var stmt = getSQLStatement(req);
    connection.query(stmt, function(error, found){
	    if(error) throw error;
	    res.render('quotes', {quotes: found, clickedAuthor: null});
	});
    // console.log(stmt);
    
});


app.get("/author/:id", function(req, res) {
    var stmt = "select * from l9_author where authorId=" + req.params.id + ";";
    connection.query(stmt, function(error, found){
	    if(error) throw error;
	    res.send(found);
	});
    

    
});

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})




function getSQLStatement(req) {
    var stmt = "select * from l9_author, l9_quotes where "; 
    var phrase = null; 
    var flag1 = 0;
    var flag2 = 0
    var flag3 = 0; 
    var flag4 = 0; 
    var allEmpty = true; 
    
    if (req.query.keyword.length) {
        flag1 = 1; 
        allEmpty = false; 
        phrase = "quote like '%" + req.query.keyword + "%'";
        stmt = stmt.concat(phrase);
    }
    if (req.query.category.length) {
        allEmpty = false; 
        flag2 = 1; 
        if (flag1) {
            stmt = stmt.concat(" and "); 
        }
        phrase = "category='" + req.query.category + "'"; 
        stmt = stmt.concat(phrase); 
    }
    if (req.query.author.length) {
        allEmpty = false; 
        flag3 = 1; 
        if (flag1 || flag2) {
            stmt = stmt.concat(" and "); 
        }
        var firstName = req.query.author.split(" ")[0]; 
        var lastName = req.query.author.split(" ")[1]; 
        phrase = "firstName ='" + firstName + "' and lastName='" + lastName + "'";
        stmt = stmt.concat(phrase); 
    }
    if (req.query.gender.length) {
        allEmpty = false; 
        flag4 = 1; 
        if (flag1 || flag2 || flag3) {
            stmt = stmt.concat(" and "); 
        }
        phrase = "sex='" + req.query.gender.toUpperCase() + "'";
        stmt = stmt.concat(phrase);
    }
    
    if (flag1 || flag2 || flag3 || flag4) {
        stmt = stmt.concat(" and "); 
    }
    stmt = stmt.concat('l9_author.authorId = l9_quotes.authorId'); 
    return stmt; 
}
