# Questions API
## REST endpoint for PHN QoL Survey

The questions REST endpoint exposes a `HTTP/1.1 GET` service, delivering a list of questions and their applicable answer sets, both in JSON format.

## Response types

All responses are delivered with `Content-Type: application/json'. The following HTTP request types are supported:
 * `GET`
 
Standard REST request handlers `POST`, `PUT` and `DELETE` are not applicable for this endpoint as questions are read-only.

### `GET /questions`

Responds with a complete list of questions as a `json` array. The hierarchy of the `json` document is as follows:

 * Array of `question` `[`
   * `question` object `{`
     * `id`: The ID of the question within the database.
     * `number`: The question number, questions are sorted according to this number ascending.
     * `text`: The question itself.
     * `answer_set_name`: A term describing the verbal delineation between response values 0..4.
     * `answers`: array of `answer_set` `[`
       * `answer_set` object `{`
         * `value`: The response value for this answer { i ∈ ℕ₀ : i ≤ 4 }.
         * `label`: The text used for this particular answer.
       * `}`
     * `]`
 * `]`

```json
[
    {
        "id": 1,
        "number": 1,
        "text": "How would you rate your quality of life?",
        "answer_set_name": "satisfaction",
        "answers": [
            {
                "value": 0,
                "label": "Very dissatisfied"
            },
            {
                "value": 1,
                "label": "Dissatisfied"
            },
            {
                "value": 2,
                "label": "Neither satisfied nor dissatisfied"
            },
            {
                "value": 3,
                "label": "satisfied"
            },
            {
                "value": 4,
                "label": "Very satisfied"
            }
        ]
    },
    {
        "id": 2,
        "number": 2,
        "text": "How satisfied are you with your health?",
        "answer_set_name": "amount.noun",
        "answers": [
            {
                "value": 0,
                "label": "Not at all"
            },
            {
                "value": 1,
                "label": "A little"
            },
            {
                "value": 2,
                "label": "A moderate amount"
            },
            {
                "value": 3,
                "label": "Very much"
            },
            {
                "value": 4,
                "label": "An extreme amount"
            }
        ]
    },
    // ...
    {
        "id": 27,
        "number": 26,
        "text": "How often do you have negative feelings such as blue mood, despair, anxiety, depression?",
        "answer_set_name": "frequency",
        "answers": [
            {
                "value": 0,
                "label": "Never"
            },
            {
                "value": 1,
                "label": "Seldom"
            },
            {
                "value": 2,
                "label": "Quite often"
            },
            {
                "value": 3,
                "label": "Very often"
            },
            {
                "value": 4,
                "label": "Always"
            }
        ]
    }        
```