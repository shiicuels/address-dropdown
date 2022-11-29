$(function(){

  getAllRegion();

// ------------------------------------------------------------- Start [On Change Events]
  $('#region').on('change', function(){

      //GET [Region] NAME
      var selected_region = $("#region option:selected").text();

      //SAVE it to the HIDDEN input
      $('input[name=region]').val(selected_region).text();

        //SET it to the LOCALSTORAGE
        localStorage.setItem('old_region', selected_region)

      //SEND [Region] CODE as parameter
      var region_code = $(this).val();

      //CALL the function that depends to the Code
      getAllProvince(region_code);
      getAllCity(region_code);

      //EMPTY the fields that do not depend
      $('#barangay').empty();
      $('#barangay').append('<option value="" Selected Disabled>Select Barangay</option>');
  });

  $('#province').on('change', function(){

      var selected_province = $("#province option:selected").text();
      $('input[name=province]').val(selected_province).text();

  });
  

  $('#city').on('change', function(){

      var selected_city = $("#city option:selected").text();
      $('input[name=city]').val(selected_city).text();
      var city_code = $(this).val();
      getAllBarangay(city_code);

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

            //GET data stored from the LOCALSTORAGE
            var old_region_value = localStorage.getItem('old_region')  //----------------------------NEW
            if (old_region_value != null) {
                $('#region').append('<option value="'+old_region_value+'" Selected Disabled>'+old_region_value+'</option>');   
            }

            //LOOP to display in dropdown
            data.forEach(element => {
                $('#region').append('<option value="'+element.code+'">'+element.name+'</option>');
            });

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
              

              data.forEach(element => {
                  $('#barangay').append('<option value="'+element.code+'">'+element.name+'</option>');
              });
          },
      })
  } 
});

// ------------------------------------------------------------- End [Functions]