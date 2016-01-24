Meteor.methods({
    "retreaveURLdata": function (url) {
        console.log(url);
        try {
            var result = HTTP.get(url);
            var $ = cheerio.load(result.content);
            var title = $('title').text();
            var description = $('meta[name="description"]').attr("content");
            if (description.length > 150){
                description = description.substring(0,150) + "...";
            }
            return {
                title: title,
                description: description
            };
        } catch (e) {
            console.log(e);
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return {
                title: "",
                description: ""
            }
        }
    }
});