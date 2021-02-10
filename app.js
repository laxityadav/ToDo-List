const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const Item = require('./models/items');

const dbUrl = 'mongodb://localhost:27017/todo';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    const items = await Item.find({});
    res.render('home', { items });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', async (req, res) => {
    const desc = req.body.description;
    const item = new Item({ desc });
    await item.save();
    const items = await Item.find({});
    res.render('home', { items });
});

app.get('/edit/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.render('edit', { item });
});

app.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await Item.findByIdAndRemove(id);
    const items = await Item.find({});
    res.render('home', { items });
});

app.put('/:id', async (req, res) => {
    const id = req.params.id;
    const desc = req.body.description;
    const item = await Item.findByIdAndUpdate(id, { desc });
    await item.save();
    const items = await Item.find({});
    res.render('home', { items });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});