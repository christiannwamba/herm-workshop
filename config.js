const config = {
	"gatsby": {
		"pathPrefix": "/",
		"siteUrl": "https://work.herm.dev",
		"gaTrackingId": "UA-156422845-1"
	},
	"header": {
		"logo": "https://res.cloudinary.com/codebeast/image/upload/v1576047740/herm-workshop/favicon.png",
		"logoLink": "https://work.herm.dev",
		"title": "workGraphQL",
		"githubUrl": "https://github.com/christiannwamba/herm-workshop",
		"helpUrl": "",
		"tweetText": "",
		"links": [
			{ "text": "", "link": ""}
		],
		"search": {
			"enabled": true,
			"indexName": "herm-workshop",
			"algoliaAppId": process.env.GATSBY_ALGOLIA_APP_ID,
			"algoliaSearchKey": process.env.GATSBY_ALGOLIA_SEARCH_KEY,
			"algoliaAdminKey": process.env.ALGOLIA_ADMIN_KEY
		}
	},
	"sidebar": {
		"forcedNavOrder": [
			"/00-before-you-start",
    	"/01-setup-ui",
			"/02-graphql-api",
      "/03-move-to-the-cloud",
      "/04-authentication",
      "/05-authorization-and-permission",
      "/06-scheduling-posts"
		],
		"links": [
			{ "text": "Herm", "link": "https://herm.dev"},
		],
		"frontline": false,
		"ignoreIndex": true,
	},
	"siteMetadata": {
		"title": "Fullstack GraphQL Workshop | Herm",
		"description": "An End to End Web App Workshop with Modern GraphQL and React",
		"ogImage": null,
		"docsLocation": "https://github.com/christiannwamba/herm-workshop/tree/master/content",
		"favicon": "/favicon.ico"
	},
};

module.exports = config;
