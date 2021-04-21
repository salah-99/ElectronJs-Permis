    // ---------------------add New Product-------------------- 

let Register = document.getElementById('save');

   Register &&  Register.addEventListener('click', () => {
   
    let matricule = document.getElementById('matricule').value;
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let confirmerPassword = document.getElementById('confirmerPassword').value;
        let phone = document.getElementById('phone').value;
        let adress = document.getElementById('adress').value;
        let license_number =document.getElementById('license_number').value

    
        let data= {
            matricule,
            firstName,
            lastName,
            email,
            password,
            confirmerPassword,
            adress,
            phone,
            license_number
        }

console.log({data})

        axios.post('http://localhost:4000/api/register',data)
            .then(function (response) {
            
                const myNotification = new Notification('Notification', {
                    body: 'Register successfully'
                })
                location.reload();
    
            })
            .catch(function (err) {
                console.log(err);
                (err.response.data.error.message!==undefined) ? 
                alert(err.response.data.error.message)
                : 
                alert(err.response.data.error.errors)
            });
    })


    let confirmer = document.getElementById('confirmer');

    confirmer && confirmer.addEventListener('click',()=>{
    let searchUrl =window.location.search;
    let newSearch= searchUrl.replace('?', '');
    let sendtoken=  newSearch.split('=');
   let token = sendtoken[0]=="token" && sendtoken[1];
console.log(token)
    axios.post('http://localhost:4000/api/confirmer',{'token':token})
    .then(function (response) {
        console.log(response);

                    const myNotification = new Notification('Notification', {
                        body: 'Confirmer successfully'
                    })
                   window.location.href="loginConducteur.html";
        
                })
                .catch(function (err) {
                    console.log(err);
                    (err.response.data.error.message!==undefined) ? 
                    alert(err.response.data.error.message)
                    : 
                    alert(err.response.data.error.errors)
                });
    })



    ///LOGIN CONDUCTEUR ///

  let  loginConducteur = document.getElementById('loginConducteur');

  loginConducteur && loginConducteur.addEventListener('click', () => {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
let data = {
    email,
    password
}
console.log(data)
    axios.post('http://localhost:4000/api/login',data)
    .then(function (response) {
        let getData= response.data;
        localStorage.setItem('auth-token', JSON.stringify(getData));
                    const myNotification = new Notification('Notification', {
                        body: 'login Conducteur successfully'
                    })
                  window.location.href="HomeConducteur.html";
        
                })
                .catch(function (err) {
                    console.log(err);
                    (err.response.data.error.message!==undefined) ? 
                    alert(err.response.data.error.message)
                    : 
                    alert(err.response.data.error.errors)
                });

})

//get Formation conducteur From token 
function getToken() {
    let rowConducteur = document.getElementById('row');

    if(localStorage.getItem("auth-token")){
let auth= JSON.parse(localStorage.getItem("auth-token"));
let {conducteur_id}=auth.conducteur_token;

         axios.get(`http://localhost:4000/api/findConducteur/${conducteur_id}`)
         .then(function (response) {
        let element =  response.data.conducteur ||  {}
                 rowConducteur.innerHTML += `<tr><td>
                 <span class="custom-checkbox">
                     <input type="checkbox" id="checkbox1" name="options[]" value="1">
                     <label for="checkbox1"></label>
                 </span>
             </td>
             <td>${element.firstName}</td>
             <td>${element.lastName}</td>
             <td>${element.email}</td>
             <td>${element.adress}</td>
            <td>${element.phone}</td>
             <td>${element.license_number}</td>
             <td style='color:red'>${element.numberPoints}</td>
     </tr>`
               
          
            
        }).catch(function (err) {
            console.log(err);
        });
        

    }
    
}

let logout = document.getElementById('logout');
logout && logout.addEventListener('click',()=>{
    if(localStorage.getItem('auth-token')){
        localStorage.clear();
        logout.setAttribute('href',"loginConducteur.html")
    }
})
