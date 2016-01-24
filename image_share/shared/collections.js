Images = new Mongo.Collection("images");
console.log(Images.find().count());

Images.allow({
    insert: function(userId,doc){
        console.log("test security on image insert");
        if (Meteor.user()){
            console.log(doc);
            doc.createdBy = userId;
            if (userId != doc.createdBy){
                return false;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    remove: function(userId,doc){
        return true;
    }
});