const ethers = require('ethers');

const {render} = require('ejs');

const express = require('express');

const url = require('url');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const {default: Resolution} = require('@unstoppabledomains/resolution');

const resolution = new Resolution();

require('dotenv').config()

const cors = require("cors")



app = express();

app.use(cors());

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(express.urlencoded({extended:true})) 

const provider =  new ethers.providers.JsonRpcProvider(process.env.Infura_Id);

app.get("/", (req,res)=>{

  res.send('Welcome to Ens Search!');

  })

app.get("/api/:id",async (req,res)=>{
    
                var ensNameValue = req.url;

                var ensNameSlice;

                // check if url given is null or is it a address else assaign ensname to go pass througth the .eth store
                
               
                  try{

                  
                if(ensNameValue != null && !ensNameValue.includes('.eth')){

                  var ens = ensNameValue.slice(5,ensNameValue.length);

                  console.log(ens);

                  ensNameSlice = await provider.lookupAddress(ens);

                  
                } else {

                  ensNameSlice = ensNameValue.slice(5,ensNameValue.length);
               
                console.log(ensNameSlice);

                }
                

                // if ens name not null it will pass through this if cluase and it will only pass through if it is ens name.
                // if address in the above clause doesnt resolve else cluase will give ens not registerted answer.
        
            if(ensNameSlice != null && (ensNameSlice.includes('.eth') || !ensNameSlice.includes('0x'))){
                     
                      
                 var address,profile,ipfs,email,website,twitter,discord,github,telegram,description,reddit;

           // get resolver from the obtained ens name now and process continues.

                 const result =  await provider.getResolver(ensNameSlice);

                
                  if(result!= null){

                   

                   let address1 =  result.getAddress();

                   let profile1 =  result.getAvatar();

                    let ipfs1 =  result.getContentHash();
                 
                  let  email1 =    result.getText("email");
                                    
                   let website1 =  result.getText("url");
                    
                  let  twitter1 =  result.getText("com.twitter");
                    
                  let  discord1 =  result.getText('com.discord');
                    
                  let  github1 =    result.getText('com.github');
                    
                 let   telegram1 =  result.getText('org.telegram');
                                    
                  let  description1 =  result.getText('description');

                  let  reddit1 =  result.getText('com.reddit');

                    Promise.all([address1,profile1,ipfs1,email1,website1,twitter1,discord1,github1,telegram1,description1,reddit1]).then( e=>{

res.json({
                      'Name':ensNameSlice,
                      'Address':e[0],
                    'Email': e[1],
                    'Profile': e[2],
                    'Ipfs':e[3],
                    'Website': e[4],
                    'Twitter': e[5],
                    'Discord': e[6],
                    'Github':e[7],
                    'Telegram': e[8],
                    'Description':e[9],
                    'Reddit': e[10]
                    })
           }
 )
              
                  } else {

                    console.log('resolver null')

                    res.json({'Message':'ENS Name Not Registered'})
                  }

    
            }  else {console.log('resolver null')

            res.json({'Message':'ENS Name Not Registered or Not Found'})
           
          } 
        }catch{
                    res.json({'Message':'ENS Name Not Registered or Not Found'})
                  }}


    ) 


// here uns resolver is used

  app.get("/apiuns/:id",async(req,res)=>{

  let _ethValue = req.url.slice(8,req.url.legth);

    
  if(_ethValue.includes('.zil')){

    resolve(_ethValue, 'ZIL');

  } else {

  resolve(_ethValue, 'ETH');
 
  }

  function resolve(domain, currency) {

    resolution

      .addr(domain, currency)

      .then((address) => {

        console.log(domain, 'resolves to', address)

         if(address){

                fetch(`https://resolve.unstoppabledomains.com/metadata/${domain}`, {

                  method: "GET",
                  headers: {
                    'Authorization': process.env.auth,
                    "accept": "application/json",
                            
                        }
                })
                .then(response => response.json()) 

                .then(async(_response) =>{

                  console.log(_response)

                return res.json({
                  'address':address,
                  'err':false,
                  'Exists':true,
                  'data':_response,
     
                })
                

                })
                .catch(err => res.json({"error":err.code}));
              
              
        } else{

          return req.json({"info":"address not set"});

        }
    })

      .catch(err=>{res.json({err})});
       
  }
 



// for 404 error pages


  })
  
     app.use((req,res)=>{

      res.render('404')

     })
  

 app.listen(process.env.PORT || 3000,()=>{

    console.log('Porrt listening on 3000 port')

})

