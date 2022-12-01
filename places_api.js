getAllRegion();

var region_hidden = document.getElementById('region_hidden');
var province_hidden = document.getElementById("province_hidden");
var city_hidden = document.getElementById("city_hidden");
var barangay_hidden = document.getElementById("barangay_hidden");

var address_line_one = document.getElementById("address_line_one");

stored_region = localStorage.getItem('stored_region');
stored_province = localStorage.getItem('stored_province');
stored_city = localStorage.getItem('stored_city');
stored_barangay = localStorage.getItem('stored_barangay');

// ------------------------------------------------------------- Start [On Change Events]

$('#address_line_one').on('change', function(){

    //CLEAR result from previous selected
    $('#region').empty();

    if (address_line_one.value == "" || address_line_one.value == null) {
        appendDisabledOptions();
    }else{

        //GET data stored from the LOCALSTORAGE
        myLocalStorage();
    }

    getAllRegion();

});

$('#region').on('change', function(){

    //GET [Region] NAME
    var selected_region = $("#region option:selected").text();

    //SAVE it to the HIDDEN input
    $('input[name=region_hidden]').val(selected_region).text();

    //SET it to the LOCALSTORAGE
    localStorage.setItem('stored_region', selected_region);

    //SEND [Region] CODE as parameter
    var region_code = $(this).val();

    //CALL the function that depends to the Code
    getAllProvince(region_code);
    getAllCity(region_code);

    //EMPTY the fields that do not depend
    $('#barangay').empty();
    $('#barangay').append('<option value="" Selected Disabled>Select Barangay</option>');

    saveAllToHiddenFields();
});

$('#province').on('change', function(){

    var selected_province = $("#province option:selected").text();
    $('input[name=province_hidden]').val(selected_province).text();
    localStorage.setItem('stored_province', selected_province);
    saveAllToHiddenFields();

});


$('#city').on('change', function(){

    var selected_city = $("#city option:selected").text();
    $('input[name=city_hidden]').val(selected_city).text();
    localStorage.setItem('stored_city', selected_city);
    saveAllToHiddenFields();
    var city_code = $(this).val();
    getAllBarangay(city_code);

});

$('#barangay').on('change', function(){

    var selected_barangay = $("#barangay option:selected").text();
    $('input[name=barangay_hidden]').val(selected_barangay).text();
    localStorage.setItem('stored_barangay', selected_barangay);
    saveAllToHiddenFields();

});
// ------------------------------------------------------------- End [On Change Events]

// ------------------------------------------------------------- Start [Functions]

function getAllRegion() {
    $.ajax({
        type: 'get',
        url: 'https://psgc.gitlab.io/api/regions',
        success: function(data) {

            //PARSING for foreach loop
            data = JSON.parse(data);

            //SORT data
            data.sort(function(a,b){ return a.name.localeCompare(b.name); });

            // CHECK if [Address Line One] is not empty (after error occured)
            if (address_line_one.value == "" || address_line_one.value == null) {

                appendDisabledOptions();

            }else{

                //GET data stored from the LOCALSTORAGE
                myLocalStorage();

                //LOOP to display in dropdown
                data.forEach(element => {
                    $('#region').append('<option value="'+element.code+'">'+element.name+'</option>');
                });
            }
            
            //SAVE the data from local storage before registering
            saveAllToHiddenFields();
            
        },
    })


}

function getAllProvince(region_code) {
    $.ajax({
        type: 'get',
        url: 'https://psgc.gitlab.io/api/regions/'+region_code+'/provinces',
        success: function(data) {

            //CLEAR result from previous selected
            $('#province').empty();

            data = JSON.parse(data);
            data.sort(function(a,b){ return a.name.localeCompare(b.name); });
            
            //RESELECT so must clear the input
            $('#province').append('<option value="" Selected Disabled>Select Province</option>');

            //ADDING [Metro Manila] as a result
            if(region_code==130000000){ $('#province').append('<option value="Metro Manila">Metro Manila</option>'); }
            else
            {
                data.forEach(element => {
                    $('#province').append('<option value="'+element.code+'">'+element.name+'</option>');
                });
            }

        },
    })
}

function getAllCity(region_code) {
    $.ajax({
        type: 'get',
        url:  'https://psgc.gitlab.io/api/regions/'+region_code+'/cities-municipalities',
        success: function(data) {

            //CLEAR result from previous selected
            $('#city').empty();

            data = JSON.parse(data);
            data.sort(function(a,b){ return a.name.localeCompare(b.name); });

            //RESELECT so must clear the input
            $('#city').append('<option value="" Selected Disabled>Select City</option>');

            data.forEach(element => {
                $('#city').append('<option value="'+element.code+'">'+element.name+'</option>');
            });

        },
    })
}

function getAllBarangay(city_or_municipality_code) {
    $.ajax({
        type: 'get',
        url:  'https://psgc.gitlab.io/api/cities-municipalities/'+city_or_municipality_code+'/barangays',
        success: function(data) {

            $('#barangay').empty();
            data = JSON.parse(data);
            data.sort(function(a,b){ return a.name.localeCompare(b.name); });
            
            //RESELECT so must clear the input
            $('#barangay').append('<option value="" Selected Disabled>Select Barangay</option>');

            data.forEach(element => {
                $('#barangay').append('<option value="'+element.code+'">'+element.name+'</option>');
            });
        },
    })
} 


function saveAllToHiddenFields(){
    region_hidden = localStorage.getItem('stored_region');
    province_hidden = localStorage.getItem('stored_province');
    city_hidden = localStorage.getItem('stored_city');
    barangay_hidden = localStorage.getItem('stored_barangay');

    //alert('THIS IS FOR TESTING ONLY: '+region_hidden+' '+province_hidden+' '+city_hidden+' '+barangay_hidden+' '+' Are all saved to hidden fields')

}

function myLocalStorage() {

    $('#region').empty();
    $('#province').empty();
    $('#city').empty();
    $('#barangay').empty();

    if (stored_region != null) {
        $('#region').append('<option value="'+stored_region+'" Selected Disabled>'+stored_region+'</option>');
    }else{
        $('#region').append('<option value="" Selected Disabled>Select Region</option>');
    }

    if (stored_province != null){
        $('#province').append('<option value="'+stored_province+'" Selected Disabled>'+stored_province+'</option>');
    }else{
        $('#province').append('<option value="" Selected Disabled>Select Province</option>');
    }

    if (stored_city != null) {
        $('#city').append('<option value="'+stored_city+'" Selected Disabled>'+stored_city+'</option>');
    }else{
        $('#city').append('<option value="" Selected Disabled>Select City</option>');
    }

    if (stored_barangay != null)
    {
        $('#barangay').append('<option value="'+stored_barangay+'" Selected Disabled>'+stored_barangay+'</option>');
    }else{
        $('#barangay').append('<option value="" Selected Disabled>Select Barangay</option>');
    }

}

function appendDisabledOptions() {

    $('#region').empty();
    $('#region').append('<option value="" Selected Disabled>Select Region</option>');  
    
    $('#province').empty();
    $('#province').append('<option value="" Selected Disabled>Select Province</option>');

    $('#city').empty();
    $('#city').append('<option value="" Selected Disabled>Select City</option>');

    $('#barangay').empty();
    $('#barangay').append('<option value="" Selected Disabled>Select Barangay</option>');

}
// ------------------------------------------------------------- End [Functions]