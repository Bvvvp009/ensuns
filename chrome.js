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

                  
                if(ensNameValue && !ensNameValue.includes('.eth') && ensNameValue.length>42){

                  var ens = ensNameValue.slice(5,ensNameValue.length);

                  console.log(ens);

                  ensNameSlice = await provider.lookupAddress(ens);

                  console.log(ensNameSlice)

                  
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

                   

                    address = await result.getAddress();

                    profile = await result.getAvatar();

                    ipfs = await result.getContentHash();
                 
                    email =   await result.getText("email");
                                    
                    website = await result.getText("url");
                    
                    twitter = await result.getText("com.twitter");
                    
                    discord = await result.getText('com.discord');
                    
                    github =   await result.getText('com.github');
                    
                    telegram = await result.getText('org.telegram');
                                    
                    description = await result.getText('description');

                    reddit = await result.getText('com.reddit');
                

                    res.json({
                      'Name':ensNameSlice,
                      'Address':address,
                    'Email': email,
                    'Profile': profile,
                    'Ipfs':ipfs,
                    'Website': website,
                    'Twitter': twitter,
                    'Discord': discord,
                    'Github':github,
                    'Telegram': telegram,
                    'Description':description,
                    'Reddit': reddit
                    })
      
      
                                 
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
//  https://resolve.unstoppabledomains.com/metadata/sandy.nft
                // fetch(`https://resolve.unstoppabledomains.com/domains/${domain}`, {
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
  

 app.listen(process.env.PORT || 3001,()=>{

    console.log('Porrt listening on 3001 port')

})

