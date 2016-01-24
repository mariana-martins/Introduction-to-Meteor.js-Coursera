	Comments.publish = function(message, websiteId){
		console.log("Publish " + message + " to " + websiteId);
		this.insert({
			message: message,
			date: new Date(),
			userId: Meteor.userId(),
			websiteId: websiteId
		});
	};

	Comments.list = function(websiteId){
		return this.find({websiteId: websiteId}, {sort: {date: -1}});
	};

	//Route

	Router.configure({
		layoutTemplate: 'ApplicationLayout'
	});

	Router.route('/', function () {
		this.render('welcome', {to:'main'});
	});

	Router.route('/website_list', function () {
		this.render('navbar', {to:'navbar'});
		this.render('website_list', {to:'main'});
	});

	Router.route('/detailpage/:_id', function () {
		this.render('navbar', {to:'navbar'});
		this.render('detailpage', {
			to:'main',
			data: function(){
				var websiteId = this.params._id;
				Meteor.subscribe("websiteDetails", websiteId);
				Meteor.subscribe("websiteComments", websiteId);
				return Websites.findOne({_id: websiteId});
			}
		});
	});



	//Accounts
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});


	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites: function() {
			Meteor.subscribe("websiteSearch", Session.get("searchValue"));
			return Websites.find({}, {sort:{vote:-1}});
		}
	});


	Template.body.helpers({
		username: function(){
			if (Meteor.user()){
				return Meteor.user().username;
				//return Meteor.user().emails[0].address;
			}
			else {
				return "Anonymous Internet User";
			}
		}
	});
	/////
	// template events 
	/////

	Template.detailpage.helpers({
		comments: function() {
			return Comments.list(this._id);
		}
	});

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			Websites.update(
					{_id:website_id},
					{$inc: {vote: 1}}
			);

			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			Websites.update(
					{_id:website_id},
					{$inc: {vote: -1}}
			);

			return false;// prevent the button from reloading the page
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event) {

			// here is an example of how to get the url out of the form:
			var title, url, description;
			title = event.target.title.value;
			url = event.target.url.value;
			description = event.target.description.value;
			if (Meteor.user()) {
				Websites.insert({
					title: title,
					url: url,
					description: description,
					createdOn: new Date(),
					createdBy: Meteor.user()._id,
					vote:0
				});

			}
		},
		"keydown #url":function(event, template){
			clearTimeout(Session.get("keydown_url"));
			var pointer = setTimeout(function() {
				Meteor.call("retreaveURLdata", event.target.value, function(error, response) {
					if (!error) {
						console.log(response);
						$("#title").val(response.title);
						$("#description").val(response.description);
					}
				});
			}, 2000);
			Session.set("keydown_url", pointer);
		}
	});

	Template.detailpage.events({
		'submit form': function(e, template) {
			console.log(this);
			e.preventDefault();
			var textarea = template.find("textarea");
			Comments.publish(textarea.value, this._id);
			textarea.value = "";
		}
	});

	Template.website_list.events = {
		'keypress input.js-search': function (event) {
			if (event.which === 13) {
				console.log("keypress");
				search(event.target.value, event);
			}
		},
		'click .js-btn-search': function(event, template){
			console.log("click");
			var text = template.find("input.js-search").value;
			search(text, event);
		}
	};

	function search (text, event){
		event.preventDefault();
		console.log("'" + text + "'");
		Session.set("searchValue", text);
	};

