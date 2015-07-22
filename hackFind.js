Anno=new Meteor.Collection('anno');
modId="a556tmtm3PJNniDtG";
//modId="Hro4WqorQ72FiYif4";
var DateFormats = {
       
       frmt: "HH:mm a"
};
UI.registerHelper("formatDate", function(datetime, format) {
  if (moment) {
    // can use other formats like 'lll' too
    format = DateFormats[format] || format;
    return moment(datetime).format(format);
  }
  else {
    return datetime;
  }
});
if (Meteor.isClient) {
  Template.portal.users = function () {
  return Meteor.users.find().fetch().reverse();
};

Template.head.helpers({
  'name': function() {
    return Meteor.user().profile.name;
  },
  'twitimg': function() {
    return Meteor.user().services.twitter.profile_image_url;
  },
  'faimg': function() {
    return Meteor.user().services.facebook.id;
  }

});
Template.portal.helpers({
'ann':function(){
  return Anno.find({},{sort: {time: -1}});
},
'mod':function(){

  if(Meteor.userId()==modId)
  {

    return true;
  }
  else
    return false;
}
});
Template.portal.events({
  'click button':function(event){
    event.preventDefault();
    if( Meteor.userId()==modId)
{
    var x=document.getElementById('addAnno').value;
    Meteor.call("addAnn", x);
    document.getElementById('addAnno').value="";
  }
}
});
}

if (Meteor.isServer) {
  
}
Meteor.users.initEasySearch('profile.name');

EasySearch.createSearchIndex('users', {
  field: 'profile.name',
  collection: Meteor.users,
  use: 'mongo-db',
  query: function (searchString, opts) {
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    // Make the emails searchable
    query.$or.push({
      emails: {
        $elemMatch: {
          address: { '$regex' : '.*' + searchString + '.*', '$options' : 'i' }
        }
      }
    });

    return query;
  }
});

Meteor.methods({
  addAnn: function (text) {
    modId="a556tmtm3PJNniDtG";
    //modId="Hro4WqorQ72FiYif4";
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if(Meteor.userId()!=modId){
      throw new Meteor.Error("not-moderator");
    }
 
    Anno.insert({
createdBy:Meteor.userId(),
time:new Date(),
content:text
});
  }
});

