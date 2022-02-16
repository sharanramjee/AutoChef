const endpointId = "4877442376907358208";
const project = 'cs-329s-final-project';
const location = 'us-central1';
const {instance, params, prediction} =
  aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

const {PredictionServiceClient} = aiplatform.v1;
const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};

const predictionServiceClient = new PredictionServiceClient(clientOptions);

async function predictObjects(filename) {
  const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

  const parametersObj = new params.ImageClassificationPredictionParams({
    confidenceThreshold: 0.5,
    maxPredictions: 5,
  });
  const parameters = parametersObj.toValue();

  const image = fs.readFileSync(filename, 'base64');
  const instanceObj = new instance.ImageClassificationPredictionInstance({
    content: image,
  });
  const instanceValue = instanceObj.toValue();

  const instances = [instanceValue];
  const request = {
    endpoint,
    instances,
    parameters,
  };

  // Predict request
  const [response] = await predictionServiceClient.predict(request);
  const predictions = response.predictions;

  var out = [];
  for (const predictionValue of predictions) {
    const predictionResultObj =
      prediction.ClassificationPredictionResult.fromValue(predictionValue);
    for (const [i, label] of predictionResultObj.displayNames.entries()) {
        out.push(label)
    }
  }
  return out;
}