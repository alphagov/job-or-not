(function(){
  "use strict";

  var search = {
    search: function(e){
      e.preventDefault();
      var $input = search.locationBox.find('input');

      search.results = new Jobs({ location: $input.val() });
      search.results.load($input.val()).done(function(){
        search.displayJob();
      });
      search.locationBox.hide();
    },
    displayJob: function(){
      var currentJob = false;
      if(currentJob = search.results.next()){
        search.resultBox.show();
        $('#job-info').html('<h1>' + currentJob.title + '</h1>'
          + '<p class="description">' + currentJob.description + '</p>');
      } else {
        search.displayResults();
      }
    },
    pick: function(e){
      e.preventDefault();
      if($(this).val() === 'Yes'){
        search.results.selectJob();
      }
      search.displayJob();
    },
    displayResults: function(e){
      if(e) e.preventDefault();
      search.resultBox.hide();
      search.statsBox.show();
      search.statsBox.find('#average-salary').html('&pound;' + Math.round(search.results.averageSelectedJobSalary()));

      var words = search.results.selectedJobTitleWords(),
          i, _i, list = [],
          max = words[0][1];
      for(i=0,_i=(words.length>10?10:words.length); i<_i; i++){
        list.push('<li class="size-'+ Math.ceil(10*(words[i][1]/max)) +'">'+words[i][0]+'</li>');
      }
      search.statsBox.find('#job-titles').html(list.join(''));

    },
    init: function(){
      search.locationBox = $('#location-box');
      search.resultBox = $('#result-box');
      search.statsBox = $('#stats-box');

      search.resultBox.hide();
      search.statsBox.hide();
      search.locationBox.find('form').submit(search.search);
      search.resultBox.on('click', 'input', search.pick);
      search.resultBox.on('click', 'a', search.displayResults);
    }
  }
  window.search = search;
}());
