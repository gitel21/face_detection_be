const PAT = '15fe0f2c689344c4b999e5c475ebac46';
const USER_ID = 'clarifaiapiel21';
const APP_ID = 'face-detection';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = () => (req, res) => {

   stub.PostModelOutputs(
      {
         user_app_id: {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
         model_id: MODEL_ID,
         version_id: MODEL_VERSION_ID,
         inputs: [{ data: { image: { url: req.body.input, allow_duplicate_url: true}}}]
      },
      metadata,
      (err, response) => {
         if (err) {
            throw new Error(err);
         }

         if (response.status.code !== 10000) {
            throw new Error("Post model outputs failed, status: " + response.status.description);
         }

         const output = response.outputs[0];

         console.log("Predicted concepts:");
         for (const concept of output.data.concepts) {
            console.log(concept.name + " " + concept.value);
         }
         res.json(response);
      }
   )
}

const handleImage = (db) => (req, res) => {
   const { id } = req.body;

   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
      res.json(entries[0].entries);
   })
   .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
   handleImage,
   handleApiCall
};