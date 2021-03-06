function exists(value, array)
{
  if(jQuery.inArray(value.val(),array) != -1)
    return true;
  return false;
}

function exists_overall(value, array)
{
  var exists_in_array = false;
  $.each(array,function(index,obj)
  {
    if(obj.value == value.val() && obj.id == parseInt(value.nextAll('input').first().val()))
    {
      exists_in_array = true;
      return false;
    }
  });
  return exists_in_array;
}

var dates = [];



$( function() {
  $(".member").autocomplete({
    source: all_members,
    minLength: 0,
   select: function(event, ui) {
     $(this).nextAll('input').first().val(ui.item.id);
  }
}).bind('focus', function(){ $(this).autocomplete("search"); } );

});



 var steps = 0;

 $( function() {
     $( ".datepicker" ).datepicker(
       {
        minDate: 0,
        dateFormat: "dd-mm-yy",
        onClose:function(date_selected)
        {
          if(steps != 0)
          {
            if(date_selected)
            {
              if(jQuery.inArray(date_selected,dates) == -1)
                $('.step-' + steps + ' > .date-selected').append("<div class=\"date-chosen\">" + date_selected + "<span class=\"delete\">X</span></div>");
            }
            $(this).val('');

          }
        }
       });


  } );

 var max_steps = parseInt($(".steps").children().last().attr('class').split('-')[1]);

 function hide_components(section)
 {
   $(".hide-seek").css('display', 'none');
   $(section).css('display', 'none');
   $(".prev").css('display', 'inline');
 }

function update_value(value)
{
  $(value).css('display', 'inline');
  $(value).css('float', 'right');
  $(value).css('width','49%');
}

function fix_value(value)
{
  $(value).css('display', 'block');
  $(value).css('float', '');
  $(value).css('width','');
}


function get_person(getter)
{
  return getter.parent().parent().attr('class').split('-')[1];
}

function exists_dict(value, array)
{
  var is_in_array = false;
  $.each(array,function(index,obj)
  {
    if(obj.val == value.val && obj.person == value.person)
    {
      is_in_array = true;
      return false;
    }
  });
  if(is_in_array)
    return true;
  else
    return false;
}


var current_selections = [];

$("body").on('click', '.date-chosen',function(){
  var value = $(this).html().split('<')[0];
  var datepicker = $('#' + steps);
  datepicker.val(value);
  var day =
  {
    val: value,
    morning: false,
    afternoon: false,
    person: current_selections[get_person($(this)) - 1].value
  };
  if(!exists_dict(day, dates))
  {
    if(day.morning == true)
      $(this).parent().next('.checkboxes').find('.morning').prop('checked', true);
    else
      $(this).parent().next('.checkboxes').find('.morning').prop('checked', false);
    if(day.afternoon == true)
      $(this).parent().next('.checkboxes').find('.afternoon').prop('checked', true);
    else
      $(this).parent().next('.checkboxes').find('.afternoon').prop('checked', false);
    dates.push(day);

  }
  else
  {
    $.each(dates,function(index,obj)
    {
      if(obj.val == day.val && obj.person == day.person)
      {
        day =
        {
          morning: obj.morning,
          afternoon: obj.afternoon
        };
        return false;
      }
    });


    if(day.morning == true)
      $(this).parent().next('.checkboxes').find('.morning').prop('checked', true);
    else
      $(this).parent().next('.checkboxes').find('.morning').prop('checked', false);
    if(day.afternoon == true)
      $(this).parent().next('.checkboxes').find('.afternoon').prop('checked', true);
    else
      $(this).parent().next('.checkboxes').find('.afternoon').prop('checked', false);
  }
});

$(".morning").click(function()
{
  var value = $('#' + steps);
  var current_state = $(this).prop('checked');

  var current_member = $(this).parents().eq(2).prop('className').split('-')[1];
  $.each(dates, function(index, obj)
  {
    if(obj.val == value.val() && current_selections[current_member - 1].value == obj.person)
    {
      obj.morning = current_state;
      return false;
    }
  });
});

$(".afternoon").click(function()
{
  var value = $('#' + steps);
  var current_state = $(this).prop('checked');
  var current_member = $(this).parents().eq(2).prop('className').split('-')[1];


  $.each(dates, function(index, obj)
  {
    if(obj.val == value.val() && current_selections[current_member - 1].value == obj.person)
    {
      obj.afternoon = current_state;
      return false;
    }
  });
});

$("body").on('click', '.delete',function(e){
  e.stopPropagation();
  data = this;
  dates = jQuery.grep(dates, function(value) {
    return value.val != $(data).parent().val().split('<')[0];
  });
  $(this).parent().remove();
  $(".datepicker").val('');
});

function choose_date()
{
  var first_person = current_selections[0].value;
  var first_person_array = [];
  $.each(dates,function(index,obj)
  {
    if(obj.person == first_person)
    {
      var day =
      {
        val: obj.val,
        morning: obj.morning,
        afternoon: obj.afternoon,
        person : obj.person
      };
      first_person_array.push(day);
    }
  });

  var equals = 1;
  var chosen_date = {};

  $.each(first_person_array,function(index,obj)
  {
    equals = 1;
    $.each(dates,function(index,obj1)
    {
      if((obj.person != obj1.person
        && obj.val == obj1.val)
        && ( obj.morning == obj1.morning
        || obj.afternoon == obj1.afternoon))
        equals++;
      if (equals == 4)
      {
        if(obj.morning == true)
        {
          chosen_date = {
             date: obj.val,
             when: 'Morning'
          };
        }
        else if (obj.afternoon == true)
        {
          chosen_date = {
            date: obj.val,
            when: 'Afternoon'
          };
        }
        return false;
      }
    });
    if(equals == 4)
    {
      return false;
    }
  });

  if(equals != 4)
  {
    return -1;
  }
  first_person_array = [];
  return chosen_date;
}


 $(".next").click(function()
 {
   if(steps == 0)
   {
     var submitting = true;
     current_selections = [];

     $("#new-form .member").each(function()
     {
       if(!exists_overall($(this),current_selections) && exists_overall($(this), all_members))
       {
         $(this).css('border-color','green');
         $('.error-msg').css('display', 'none');
         var value_this = {id:$(this).nextAll('input').first().val(), value: $(this).val() }
         current_selections.push(value_this);
       }
       else
       {
         $(this).css('border-color','red');
         $('.error-msg').css('display', 'inline');
         current_selections = [];
         submitting = false;
       }
     });
     if(submitting)
     {

       if($("#Place").val())
       {
         $("#Place").css('border-color', 'green');
         if($("#automatic").is(":checked"))
         {
           $(".heading").css('color', '');
           steps++;
           update_value($(this));
           hide_components('#date-section');
           $(".automatic-date").css('display', 'block');
           $(".manual-date").css('display', 'none');
           $(".step-"+steps).css('display','block');
         }
         else if($("#manual").is(":checked"))
         {
           $(".heading").css('color', '');
           hide_components('#date-section');
           $('#man-date-section').css('display', 'block');
           $(".automatic-date").css('display', 'none');
           $(".manual-date").css('display', 'block');
           update_value($('.submit'));
           $(this).css('display', 'none');
         }
         else
         {
           $(".heading").css('color', 'red');
         }
      }
      else
      {
        $("#Place").css('border-color', 'red');
      }

     }
   }
   else
   {
     $(".step-" + steps).css('display','none');
     steps++;
     $(".step-" + steps).css('display','block');
     if(steps == max_steps)
     {
       $(this).css('display', 'none');
       update_value($('.submit'));
       var message = choose_date();
       if(message == -1)
       {
         $(".final-message").css('color', 'red');
         $(".final-message").html('The date undefined. Please, chose a manual date or go back and add dates');
       }
       else
       {
         $(".final-message").css('color', 'green');
         $(".final-message").html('The chosen date is  ' + message.date + ' ' + message.when + ' . Click submit, please!');
         $("#ManualDate").val(message.date);
         if(message.when == 'Morning')
          $("#man_morning").prop('checked', true);
         else
          $("#man_afternoon").prop('checked', true);
       }

     }
   }
 });

$(".prev").click(function()
{
  var is_manual = $("#manual").is(":checked");
  if(is_manual)
  {
    $("#date-section").css('display', 'block');
    $(".hide-seek").css('display', 'block');
    fix_value($(".next"));
    $('#man-date-section').css('display', 'none');
    $(this).css('display', 'none');
    $(".manual-date").css('display', 'none');
    $(".submit").css('display', 'none');
    return;
  }
  else
  {
    $(".step-" + steps).css('display','none');
    steps--;
    if( steps == 0)
    {
      $("#date-section").css('display', 'block');
      $(".hide-seek").css('display', 'block');
      fix_value($(".next"));
      $(this).css('display', 'none');
      return;
    }
    else if(steps == max_steps - 1)
    {
      fix_value($(".submit"));
      update_value($(".next"));
      $(".submit").css('display', 'none');
    }
    $(".step-" + steps).css('display','block');

  }
});

var clicked = null;

$(".simple-table td").click(function()
{
  $('.load-field').val($(this).attr('id'));
  clicked = true;
});


$(".submit-load").click(function()
{
  if(clicked != null)
    $(this).closest("form").submit();
});
