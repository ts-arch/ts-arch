# Architecture Notes

The data flow is `extraction -> projection -> assertion` and is coordinated by the `fluentapi`

## fluentapi
This is the api layer of this project. It is the layer that defines the language of rules and their possible combinations. 
It coordinates extraction, projection and assertion in order to get all violations according the given rule.

## extraction
This layer extracts data from the given project

## projection
The projection layer handles processing of extracted graph data into a specific format. The processed data can then be used for 
assertions or further projection.

## assertion
Assertions analyze the projected data and extract violations according to the given rule. They are allowed to make further 
projections in order to achieve their goal, e.g. filter projected edges before projecting them into cycles.

## error
Defines base errors which can be thrown

## util
Utility functions which are not tied to a specific layer
