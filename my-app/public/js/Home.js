$(document).ready(function(){
	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
	// Select/Deselect checkboxes
	var checkbox = $('table tbody input[type="checkbox"]');
	$("#selectAll").click(function(){
		if(this.checked){
			checkbox.each(function(){
				this.checked = true;                        
			});
		} else{
			checkbox.each(function(){
				this.checked = false;                        
			});
		} 
	});
	checkbox.click(function(){
		if(!this.checked){
			$("#selectAll").prop("checked", false);
		}
	});
});

// --------------get conducteur from db---------------- 

let rowConducteur = document.getElementById('row');

axios.get('http://localhost:4000/api/Conducteurs')
.then(function (response) {
 
    response.data.conducteurs.forEach(element => {
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
    <td>${element.numberPoints}</td>
    <td>
    <a onclick="update('${element._id}')" href="#editEmployeeModal" class="edit" data-toggle="modal" id="editCatg"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>      
    </td></tr>`
       
    });
    
}).catch(function (err) {
    console.log(err);
});

// ---------------------update Conducteur-------------------- 


function update(id){
axios.get(`http://localhost:4000/api/findConducteur/${id}`)
.then(function (response) {
    
let {conducteur} = response.data;
 document.getElementById('ctgNameToUpdate').value = conducteur.numberPoints;
 document.getElementById('ctgNameToUpdate').setAttribute('max',conducteur.numberPoints)


}).catch(function (err) {
    console.log(err);
});

let updateConducteur = document.getElementById('updateConducteur');

updateConducteur.addEventListener('click', () => {
 

    let ctgNameUpdated = document.getElementById('ctgNameToUpdate').value;
    
    let Reason= document.getElementById('Reason').value;

    var obj =     {
        numberPoints : ctgNameUpdated,
        Reason:Reason
       }

    axios.put(`http://localhost:4000/api/updateConducteur/${id}`,obj)
    .then(function (response) {
console.log(response);
        const myNotification = new Notification('Notification', {
            body: 'Conducteur updated successfully'
          })

            document.getElementById("closeUpdate").click();
            location.reload();
       
    
    }).catch(function (err) {
        console.log(err);  
})
});  
}

