(function(){
  "use strict";

  function Jobs(options){
    this.allJobs = false;
    this.callback = $.Deferred();

    this.currentJobIndex = -1;
    this.selected = [];

  }
  Jobs.prototype = {
    url: function(){
      return 'http://yagajobs.co.uk/api/vacancies.json/search';
    },
    load: function(location){
      var request;
      if(this.allJobs=== false){
        request = $.ajax({
          url: this.url(),
          dataType: 'JSON',
          data: {
            api_key: jobConfig.apiKey,
            count: '40',
            location: location
          }
        });
        request.done(this.parseJobs.bind(this));
      }
      return this.callback;
    },
    parseJobs: function(data){
      this.allJobs = data;
      this.callback.resolve();
    },
    next: function(){
      if(this.currentJobIndex+1 < this.allJobs.length){
        return this.allJobs[++this.currentJobIndex];
      } else {
        return false;
      }
    },
    selectJob: function(){
      this.selected.push(this.currentJobIndex);
    },
    selectedJobs: function(){
      var i, _i, out = [];
      for(i=0,_i=this.selected.length; i<_i; i++){
        out.push(this.allJobs[this.selected[i]]);
      }
      return out;
    },
    averageSelectedJobSalary: function(){
      var count = 0, total = 0,
          i, _i, job;
      for(i=0,_i=this.selected.length; i<_i; i++){
        job = this.allJobs[this.selected[i]];
        if(job.salaryMaxYearly && job.salaryMinYearly){
          count++;
          total = total + ((job.salaryMaxYearly + job.salaryMinYearly) / 2);
        }
      }
      return total/count;
    },
    selectedJobTitleWords: function(){
      var words = {},
          i, _i, j, _j, job, jobWords, word;
      for(i=0,_i=this.selected.length; i<_i; i++){
        job = this.allJobs[this.selected[i]];
        jobWords = job.title.split(/\s+/);
        for(j=0,_j=jobWords.length; j<_j; j++){
          if(jobWords[j].match(/[A-Za-z]/)){
            if(typeof words[jobWords[j]] === 'undefined'){
              words[jobWords[j]] = 0;
            }
            words[jobWords[j]]++;
          }
        }
      }
      jobWords = [];
      for(word in words){
        jobWords.push([word, words[word]])
      }
      jobWords.sort(function(a, b) {return b[1] - a[1]})
      return jobWords;
    }
  };
  window.Jobs = Jobs;
}());
