const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/Sample", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected with mongodb");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const productSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = new mongoose.model("Product", productSchema);

//create product
app.post("/api/v1/product/new", async (req, res) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

//Read Product
app.get("/api/v1/prodcuts", async (req, res) => {
  const prodcuts = await Product.find();

  res.status(201).json({
    success: true,
    prodcuts,
  });
});

//update product
app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });


  res.status(200).json({
    success: true,
    product
  });
});


//delete Product
app.delete("/api/v1/product/:id", async(req,res) =>{

    const product = await Product.findById(req.params.id);
   
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Producst not found"
        })
    }
     
    await product.deleteOne()

    res.status(200).json({
        success:true,
        message:"Product is deleted Successfully"
    })

})



app.listen(4500, () => {
  console.log("Server is working at http://localhost:4500");
});
