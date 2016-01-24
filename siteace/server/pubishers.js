Meteor.publish("websiteSearch", function(searchValue) {

    if (!searchValue) {
        return Websites.find({}, {sort:{vote:-1}});
    }

    return Websites.find({
        $text: {$search: searchValue}
    }, {
        fields: { score: { $meta: "textScore" } },
        sort: { score: { $meta: "textScore" } }
    });
});

Meteor.publish('websiteDetails', function(websiteId){
    return Websites.find({_id: websiteId});
});

Meteor.publish('websiteComments', function(websiteId){
    return Comments.find({websiteId: websiteId}, {sort: {date: -1}});
});