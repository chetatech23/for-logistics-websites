'use strict';

const deliverdgroup = [
  {
    NAME :  'Official Documents & Letters',
    PRICE : '2000',
    CATEGORY : 'document & paperworks'
  },
  {
    NAME :  'Passports & Certificates',
    PRICE : '1500',
    CATEGORY : 'document & paperworks' 
  },
  {
    NAME :  'Books & Office files',
    PRICE : '2500',
    CATEGORY : 'document & paperworks' 
  },
  {
    NAME :  'Clothes & Outfits',
    PRICE : '3000',
    CATEGORY : 'fashion & accessories'
  },
  {
    NAME :  'Bags & Backpacks',
    PRICE : '2000',
    CATEGORY : 'fashion & accessories' 
  },
  {
    NAME :  'Shoes & Footwear',
    PRICE : '2000',
    CATEGORY : 'fashion & accessories' 
  },
  {
    NAME :  'Jewelry & Watches',
    PRICE : '2000',
    CATEGORY : 'fashion & accessories' 
  },
  {
    NAME :  'Cooked Meals & Takeout',
    PRICE : '1200',
    CATEGORY : 'food & perishables'
  },
  {
    NAME :  'Cakes  & Pastries',
    PRICE : '1500',
    CATEGORY : 'food & perishables'
  },
  {
    NAME :  'Groceries & Drinks',
    PRICE : '1100',
    CATEGORY : 'food & perishables'
  },
  {
    NAME :  'Wigs & Hair Extensions',
    PRICE : '1300',
    CATEGORY : 'Beauty & Care'
  },
  {
    NAME :  'Skincare & Cosmetics',
    PRICE : '1100',
    CATEGORY : 'Beauty & Care'
  },
  {
    NAME :  'Perfumes & Fragrances',
    PRICE : '1500',
    CATEGORY : 'Beauty & Care'
  },  
  {
    NAME :  'Phones & Laptops',
    PRICE : '2500',
    CATEGORY : 'electronics & fragile items'
  },
  {
    NAME :  'Chargers & Accessories',
    PRICE : '2000',
    CATEGORY : 'electronics & fragile items'
  },
  {
    NAME :  'Glassware & Fragile Boxes',
    PRICE : '2000',
    CATEGORY : 'electronics & fragile items'
  },
  {
    NAME :  'Home Appliances',
    PRICE : '4000',
    CATEGORY : 'bulk & heavy items'
  },
  {
    NAME :  'Bulk Fashion Bales / Wholesale items',
    PRICE : '4000',
    CATEGORY : 'bulk & heavy items'
  },
  {
    NAME :  'Large Boxes / Event Supplies',
    PRICE : '4000',
    CATEGORY : 'bulk & heavy items'
  },
] ; 

var map = null;
var pickupmaker = null;
var deliveryMarker = null;
var pickupCoords = null;
var deliveryCoords = null;
var pickupAddressName = "Not specified";
var deliveryAddressName = "Not specified";
var calculatedDistance = 0;
var calculatedDistanceFee = 0; 
var routeLine = null;

 function initMap() {
  var mapContainer = document.querySelector('.map-container');
  
  if (mapContainer && typeof L !== 'undefined') {
    map = L.map(mapContainer).setView([6.5244, 3.3792], 10);

    // Free tile layer that works everywhere without any API key
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    }).addTo(map);
  }
}


initMap();

async function searchpickup () {
  var typedtextone = document.querySelector('.pickup-input')

   localStorage.setItem('typetextone' , typedtextone.value);

   
  var typetextonesaved = localStorage.getItem('typetextone');

  console.log(typetextonesaved);

  document.querySelector('.pickup-location').innerHTML = `PICKUP LOCATION -${typetextonesaved}`

   

  var searchUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(typedtextone.value); 

  var response = await fetch(searchUrl, {
  headers: {
    'User-Agent': 'MalisaExpressApp/1.0'
  }
});

  var data = await response.json();  

  if(data.length === 0) {
    alert('this location does not exist please try a new location');
    return;
  }

  for (var i = 0; i < data.length; i++) {
    let clickednum = data[i];

    pickupCoords = [Number(clickednum.lat) , Number(clickednum.lon)]; 

    if(pickupmaker !== null) {
      map.removeLayer(pickupmaker);
    }
    pickupmaker = L.marker(pickupCoords).addTo(map).bindPopup("searchup Location").openPopup();

    updatemaproute();
    break;
  } 
   
}

async function deliverypickup () {
  var typedtext = document.querySelector('.delivery-input'); 
  
   localStorage.setItem('typetext' , typedtext.value);

   var typetextonesavedtwo = localStorage.getItem('typetext')

    document.querySelector('.delivery-location').innerHTML = ` DELIVERY LOCATION - ${typetextonesavedtwo}` 

    console.log(typetextonesavedtwo);
   

  var searchUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(typedtext.value); 

  var response = await fetch(searchUrl);
  var data = await response.json();  

 

  for (var i = 0; i < data.length; i++) {
    let clickednum = data[i];

    deliveryCoords = [Number(clickednum.lat) , Number(clickednum.lon)]; 

    if(deliveryMarker !== null) {
      map.removeLayer(deliveryMarker);
    }
    deliveryMarker = L.marker(deliveryCoords).addTo(map).bindPopup("Delivery Location").openPopup();

    updatemaproute();
    break;
  } 
 
  
 
} 

async function updatemaproute () {
  if (pickupCoords && deliveryCoords) {
    var osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + pickupCoords[1] + ',' + pickupCoords[0] + ';' + deliveryCoords[1] + ',' + deliveryCoords[0] + '?overview=full&geometries=geojson';
    
    var response = await fetch(osrmUrl);
    var data = await response.json();

    if (data.routes && data.routes.length > 0) {
      var distancekm = (data.routes[0].distance / 1000).toFixed(1); 
      
      localStorage.setItem('distancekm', distancekm); 
     
        var distancekmones = localStorage.getItem('distancekm'); 
      console.log(distancekmones);
     
      document.querySelector('.distancekm').innerHTML = `
       DISTANCE PER KILOMETER -
      ${distancekm} KILOMETER`;

      if (routeLine !== null) {
        map.removeLayer(routeLine);
      } 

      // Reverses OSRM [Lon, Lat] into Leaflet [Lat, Lon]
      var roadPoints = data.routes[0].geometry.coordinates.map(pt => [pt[1], pt[0]]);

      routeLine = L.polyline(roadPoints, { color: 'blue', weight: 4 }).addTo(map);
      
      map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    }
  } 
} 

function delivergoods () {
  var distancekmones = localStorage.getItem('distancekm');  

 var typetextonesaved = localStorage.getItem('typetextone');
  
   var typetextonesavedtwo = localStorage.getItem('typetext');
  
  if (!typetextonesaved) {
    alert('please fill your pickup  location');

    return;
  }

  if (!typetextonesavedtwo) {
     alert('please fill your delivery location');
     
     return;
  } 


  
  if (!distancekmones) {
    alert('please fill a real location'); 

    return;
  } 

  
   
  window.location.href = 'secondpage.html';

   console.log(distancekmones + 'distance'); 
    console.log('wassup');

  

   
} ; 


  function checkifonfirstpage () {
     if(document.querySelector('.pickup-input')) {
        removelocation();
     } 
    

    else {
    var distancekmones = localStorage.getItem('distancekm');
    var typetextonesaved = localStorage.getItem('typetextone');

    // Check if data is missing (because removelocation() was run on the first page)
    if (!distancekmones || !typetextonesaved) {
     
      window.location.href = 'index.html'; 
    } 
  }
  

     
  } 

  checkifonfirstpage();


  checkifonfirstpage();

function removelocation () {

   var typetextonesavedtworemove = localStorage.removeItem('typetext');
   var typetextonesavedremove = localStorage.removeItem('typetextone');
   var distancekmremove = localStorage.removeItem('distancekm');
  document.querySelector('.delivery-input').value = "";
  document.querySelector('.pickup-input').value = "";
  console.log(distancekmremove + 'is' + 'empty');
  console.log(typetextonesavedremove + 'for pick up' + "is" + "empty");
  console.log(typetextonesavedtworemove + 'for delivery' + "is" + "empty");

}; 

   

 const savedcategory = localStorage.getItem('selectedcategory');

if (savedcategory === 'document & paperworks') {
  documentpaperworks();
} 


 if (savedcategory === 'fashion & accessories') {
    fashionaccessories();
} 

  if (savedcategory === 'food & perishables') {
    foodperishables();
}  

   
if (savedcategory === 'Beauty & Care') {
    BeautyCare();
} 
  

    
if (savedcategory === 'electronics & fragile items ') {
   electronicsfragileitems();
}  


 if (savedcategory === 'bulk & heavy items') {
      bulkheavyitems();
} 
 

function documentpaperworks() {
  localStorage.setItem('selectedcategory', 'document & paperworks');

  var content = document.querySelector('.forthirdhtml');

   var typetextonesaved = localStorage.getItem('typetextone');
    var typetextonesavedtwo = localStorage.getItem('typetext');
   var distancekmones = Number(localStorage.getItem('distancekm')); 
      console.log(distancekmones);
      console.log(typetextonesaved);
      console.log(typetextonesavedtwo);

       var priceperdistance = 9;

      var deliveryfee = priceperdistance *  distancekmones;

      console.log(deliveryfee.toLocaleString());

  content.innerHTML = ''; // Reset container 

  var totalprice = 0;

  var phoneNumber = "2348102569125";

  deliverdgroup.forEach(item => { 

      var itemprice = Number(item.PRICE);
      totalprice = itemprice + deliveryfee;


    if (item.CATEGORY === 'document & paperworks') {

      var message = `*NEW DELIVERY ORDER*

     *Item Name:* ${item.NAME}
     *Pickup Location:* ${typetextonesaved}
     *Delivery Location:* ${typetextonesavedtwo}
     *Item Price:* ₦${itemprice.toLocaleString()}
     *Delivery Fee:* ₦${deliveryfee.toLocaleString()}
     *Total Fee:* ₦${totalprice.toLocaleString()}`;

        var whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;





      content.innerHTML += `
        <div class = "h-[300px] bg-black flex flex-col justify-center gap-[15px]  text-[17px] font-['Poppins'] font-bold w-[96%] text-center rounded-[19px]  text-white">
          <p class = "" >NAME - ${item.NAME}</p>
         
          <p >PRICE  OF PRODUCT WEIGHT - ₦${itemprice.toLocaleString()}</p>
          <p>DELIVERY FEE PER KILOMETER - ₦${deliveryfee.toLocaleString()}</p>
          <p>TOTAL FEE - ₦${totalprice.toLocaleString()}<p>
          <a class=""  href="${whatsappUrl}" target="_blank" >
          <button class='w-[90%] bg-white text-black h-[60px] rounded-[20px]'>DELIVER PRODUCT ON WHATSAPP</button>
          </a>
        </div>
      `; 

    
    }
  });
}

     

  function fashionaccessories() {
  localStorage.setItem('selectedcategory', 'fashion & accessories');

  var content = document.querySelector('.forthirdhtml');

   var typetextonesaved = localStorage.getItem('typetextone');
    var typetextonesavedtwo = localStorage.getItem('typetext');
   var distancekmones = Number(localStorage.getItem('distancekm')); 
      console.log(distancekmones);
      console.log(typetextonesaved);
      console.log(typetextonesavedtwo);

       var priceperdistance = 9;

      var deliveryfee = priceperdistance *  distancekmones;

      console.log(deliveryfee.toLocaleString());

  content.innerHTML = ''; // Reset container 

  var totalprice = 0;

  var phoneNumber = "2348102569125";

  deliverdgroup.forEach(item => { 

      var itemprice = Number(item.PRICE);
      totalprice = itemprice + deliveryfee;


    if (item.CATEGORY === 'fashion & accessories') {

      var message = `*NEW DELIVERY ORDER*

     *Item Name:* ${item.NAME}
     *Pickup Location:* ${typetextonesaved}
     *Delivery Location:* ${typetextonesavedtwo}
     *Item Price:* ₦${itemprice.toLocaleString()}
     *Delivery Fee:* ₦${deliveryfee.toLocaleString()}
     *Total Fee:* ₦${totalprice.toLocaleString()}`;

        var whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;





      content.innerHTML += `
        <div class = "h-[300px] bg-black flex flex-col justify-center gap-[15px]  text-[17px] font-['Poppins'] font-bold w-[96%] text-center rounded-[19px]  text-white" >
          <p >NAME - ${item.NAME}</p>
          
          <p >PRICE BASED ON WEIGHT OF PRODUCT - ₦${itemprice.toLocaleString()}</p>
          <p>DELIVERY FEE PER KILOMETER - ${deliveryfee.toLocaleString()}</p>
          <p>TOTAL FEE - ${totalprice.toLocaleString()}<p>
          <a href="${whatsappUrl}" target="_blank">
          <button class='w-[90%] bg-white text-black h-[60px] rounded-[20px]' >DELIVER PRODUCT ON WHATSAPP</button>
          </a>
        </div>
      `; 

    
    }
  });
}

  

   function BeautyCare() {
  localStorage.setItem('selectedcategory', 'Beauty & Care');

  var content = document.querySelector('.forthirdhtml');

   var typetextonesaved = localStorage.getItem('typetextone');
    var typetextonesavedtwo = localStorage.getItem('typetext');
   var distancekmones = Number(localStorage.getItem('distancekm')); 
      console.log(distancekmones);
      console.log(typetextonesaved);
      console.log(typetextonesavedtwo);

       var priceperdistance = 9;

      var deliveryfee = priceperdistance *  distancekmones;

      console.log(deliveryfee.toLocaleString());

  content.innerHTML = ''; // Reset container 

  var totalprice = 0;

  var phoneNumber = "2348102569125";

  deliverdgroup.forEach(item => { 

      var itemprice = Number(item.PRICE);
      totalprice = itemprice + deliveryfee;


    if (item.CATEGORY === 'Beauty & Care') {

      var message = `*NEW DELIVERY ORDER*

     *Item Name:* ${item.NAME}
     *Pickup Location:* ${typetextonesaved}
     *Delivery Location:* ${typetextonesavedtwo}
     *Item Price:* ₦${itemprice.toLocaleString()}
     *Delivery Fee:* ₦${deliveryfee.toLocaleString()}
     *Total Fee:* ₦${totalprice.toLocaleString()}`;

        var whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;





      content.innerHTML += `
        <div  class = "h-[300px] bg-black flex flex-col justify-center gap-[15px]  text-[17px] font-['Poppins'] font-bold w-[96%] text-center rounded-[19px]  text-white">
          <p >NAME - ${item.NAME}</p>
          
          <p >PRICE BASED ON WEIGHT OF PRODUCT - ₦${itemprice.toLocaleString()}</p>
          <p>DELIVERY FEE PER KILOMETER - ${deliveryfee.toLocaleString()}</p>
          <p>TOTAL FEE - ${totalprice.toLocaleString()}<p>
          <a href="${whatsappUrl}" target="_blank">
          <button class='w-[90%] bg-white text-black h-[60px] rounded-[20px]' >DELIVER PRODUCT ON WHATSAPP</button>
          </a>
        </div>
      `; 

    
    }
  });
}

   



 
   function foodperishables() {
  localStorage.setItem('selectedcategory', 'food & perishables');

  var content = document.querySelector('.forthirdhtml');

   var typetextonesaved = localStorage.getItem('typetextone');
    var typetextonesavedtwo = localStorage.getItem('typetext');
   var distancekmones = Number(localStorage.getItem('distancekm')); 
      console.log(distancekmones);
      console.log(typetextonesaved);
      console.log(typetextonesavedtwo);

       var priceperdistance = 9;

      var deliveryfee = priceperdistance *  distancekmones;

      console.log(deliveryfee.toLocaleString());

  content.innerHTML = ''; // Reset container 

  var totalprice = 0;

  var phoneNumber = "2348102569125";

  deliverdgroup.forEach(item => { 

      var itemprice = Number(item.PRICE);
      totalprice = itemprice + deliveryfee;


    if (item.CATEGORY === 'food & perishables') {

      var message = `*NEW DELIVERY ORDER*

     *Item Name:* ${item.NAME}
     *Pickup Location:* ${typetextonesaved}
     *Delivery Location:* ${typetextonesavedtwo}
     *Item Price:* ₦${itemprice.toLocaleString()}
     *Delivery Fee:* ₦${deliveryfee.toLocaleString()}
     *Total Fee:* ₦${totalprice.toLocaleString()}`;

        var whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;





      content.innerHTML += `
        <div class = "h-[300px] bg-black flex flex-col justify-center gap-[15px]  text-[17px] font-['Poppins'] font-bold w-[96%] text-center rounded-[19px]  text-white">
          <p >NAME - ${item.NAME}</p>
         
          <p >PRICE BASED ON WEIGHT OF PRODUCT - ₦${itemprice.toLocaleString()}</p>
          <p>DELIVERY FEE PER KILOMETER - ${deliveryfee.toLocaleString()}</p>
          <p>TOTAL FEE - ${totalprice.toLocaleString()}<p>
          <a href="${whatsappUrl}" target="_blank">
          <button class='w-[90%] bg-white text-black h-[60px] rounded-[20px]'>DELIVER PRODUCT ON WHATSAPP</button>
          </a>
        </div>
      `; 

    
    }
  });
} 


   



  
   function electronicsfragileitems () {
  localStorage.setItem('selectedcategory', 'electronics & fragile items ');

  var content = document.querySelector('.forthirdhtml');

   var typetextonesaved = localStorage.getItem('typetextone');
    var typetextonesavedtwo = localStorage.getItem('typetext');
   var distancekmones = Number(localStorage.getItem('distancekm')); 
      console.log(distancekmones);
      console.log(typetextonesaved);
      console.log(typetextonesavedtwo);

       var priceperdistance = 9;

      var deliveryfee = priceperdistance *  distancekmones;

      console.log(deliveryfee.toLocaleString());

  content.innerHTML = ''; // Reset container 

  var totalprice = 0;

  var phoneNumber = "2348102569125";

  deliverdgroup.forEach(item => { 

      var itemprice = Number(item.PRICE);
      totalprice = itemprice + deliveryfee;


    if (item.CATEGORY === 'electronics & fragile items') {

      var message = `*NEW DELIVERY ORDER*

     *Item Name:* ${item.NAME}
     *Pickup Location:* ${typetextonesaved}
     *Delivery Location:* ${typetextonesavedtwo}
     *Item Price:* ₦${itemprice.toLocaleString()}
     *Delivery Fee:* ₦${deliveryfee.toLocaleString()}
     *Total Fee:* ₦${totalprice.toLocaleString()}`;

        var whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;





      content.innerHTML += `
        <div class = "h-[300px] bg-black flex flex-col justify-center gap-[15px]  text-[17px] font-['Poppins'] font-bold w-[96%] text-center rounded-[19px]  text-white">
          <p >NAME - ${item.NAME}</p>
          
          <p >PRICE BASED ON WEIGHT OF PRODUCT - ₦${itemprice.toLocaleString()}</p>
          <p>DELIVERY FEE PER KILOMETER - ${deliveryfee.toLocaleString()}</p>
          <p>TOTAL FEE - ${totalprice.toLocaleString()}<p>
          <a href="${whatsappUrl}" target="_blank">
          <button class='w-[90%] bg-white text-black h-[60px] rounded-[20px]'>DELIVER PRODUCT ON WHATSAPP</button>
          </a>
        </div>
      `; 

    
    }
  });
} 



  
  
   function bulkheavyitems () {
  localStorage.setItem('selectedcategory', 'bulk & heavy items');

  var content = document.querySelector('.forthirdhtml');

   var typetextonesaved = localStorage.getItem('typetextone');
    var typetextonesavedtwo = localStorage.getItem('typetext');
   var distancekmones = Number(localStorage.getItem('distancekm')); 
      console.log(distancekmones);
      console.log(typetextonesaved);
      console.log(typetextonesavedtwo);

       var priceperdistance = 9;

      var deliveryfee = priceperdistance *  distancekmones;

      console.log(deliveryfee.toLocaleString());

  content.innerHTML = ''; // Reset container 

  var totalprice = 0;

  var phoneNumber = "2348102569125";

  deliverdgroup.forEach(item => { 

      var itemprice = Number(item.PRICE);
      totalprice = itemprice + deliveryfee;


    if (item.CATEGORY === 'bulk & heavy items') {

      var message = `*NEW DELIVERY ORDER*

     *Item Name:* ${item.NAME}
     *Pickup Location:* ${typetextonesaved}
     *Delivery Location:* ${typetextonesavedtwo}
     *Item Price:* ₦${itemprice.toLocaleString()}
     *Delivery Fee:* ₦${deliveryfee.toLocaleString()}
     *Total Fee:* ₦${totalprice.toLocaleString()}`;

        var whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;





      content.innerHTML += `
        <div class = "h-[300px] bg-black flex flex-col justify-center gap-[15px]  text-[17px] font-['Poppins'] font-bold w-[96%] text-center rounded-[19px]  text-white">
          <p >NAME - ${item.NAME}</p>
         
          <p >PRICE BASED ON WEIGHT OF PRODUCT - ₦${itemprice.toLocaleString()}</p>
          <p>DELIVERY FEE PER KILOMETER - ${deliveryfee.toLocaleString()}</p>
          <p>TOTAL FEE - ${totalprice.toLocaleString()}<p>
          <a href="${whatsappUrl}" target="_blank">
          <button class='w-[90%] bg-white text-black h-[60px] rounded-[20px]' >DELIVER PRODUCT ON WHATSAPP</button>
          </a>
        </div>
      `; 

    
    }
  });
} 
  

   
  