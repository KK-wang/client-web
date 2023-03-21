import Ajv from "ajv";

const ajv = new Ajv();

const algorithmReqParamSchema = {
  type: "object",
  properties: {
    "algorithm": {
      enum: ["BBO", "GA"],
    },
    "tasks": {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          "podName": { type: "string" },
          "image": { type: "string" },
          "calcMetrics": { type: "string" },
          "nums": { 
            type: "number",
            minimum: 1,
            maximum: 99,
           },
        },
        additionalProperties: false,
        required: ["podName", "image", "calcMetrics", "nums"],
      }
    },
    "nodes": {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          "nodeName": { type: "string" },
          "cpu": { type: "number", minimum: 0, },
          "mem": { type: "number", minimum: 0, },
        },
        additionalProperties: false,
        required: ["nodeName", "cpu", "mem"],
      }
    }
  },
  additionalProperties: false,
  required: ["algorithm", "tasks", "nodes"],
};

const podCreateParamSchema = {
  type: "array",
  minItems: 1,
  items: {
    type: "object",
    properties: {
      "podName": { type: "string" },
      "image": { type: "string" },
      "nodeName": { type: "string" }
    },
    required: ["podName", "image", "nodeName"],
    additionalProperties: false,
  }
}


const algorithmReqParamValidator = ajv.compile(algorithmReqParamSchema); 

const podCreateParamValidator = ajv.compile(podCreateParamSchema);

export {
  algorithmReqParamValidator,
  podCreateParamValidator
}