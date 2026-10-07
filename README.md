# JOWILDER

Everyone plays the **nosnark** script (funny, not snarky), with no surveys. Until 2026-10-06 the game was an
experiment: each play picked one of the four scripts below at random and asked survey questions between chapters
(PBS Wisconsin players got the original script, no surveys). Add `?script_type=<key>` to load a given script.

| key | description | link |
| --- | --- | --- |
| original | base game | https://jowilder-master.netlify.app/?script_type=original |
| nohumor | no humor | https://jowilder-master.netlify.app/?script_type=nohumor |
| nosnark | no snark| https://jowilder-master.netlify.app/?script_type=nosnark |
| dry | no snark or humor | https://jowilder-master.netlify.app/?script_type=dry |


## Google Analytics: a Universal Analytics tag that should be replaced

`iframe.html` loads Google's old Universal Analytics library (`analytics.js`) with the property **`UA-72694027-9`**.
Universal Analytics shut down in July 2023, but as of 2026-10-06 Google still forwards these hits internally into the
GA4 property **`G-4JW7HRZEM0`**, which is where Jo Wilder's analytics are read now. Google can stop that forwarding
at any time without notice, so **this tag should be replaced** by a GA4 tag (`gtag.js`) sending to `G-4JW7HRZEM0`.

When replacing it, keep what the reports rely on (a first attempt, closed PR #4, changed these and was dropped):

- **Room changes are page views** whose path is the room's id (`ga('send', 'pageview', self.room.fqid)` in
  `src/scenes/ui.js`), so the GA4 Pages report lists `/tunic.historicalsociety.entry` and so on. Send them as GA4
  `page_view`s with the same path, not as a new event.
- **The game's events:** `savecode`/`used` (`src/scenes/menuScene.js`), `capitol_entry`/`available` and
  `finale`/`reached` (`src/scenes/ui.js`). Check in GA (Reports → Engagement → Events) how the forwarded ones are
  named before choosing GA4 event names, so their history carries on.
- **The referrer, which tells Vault players from PBS Wisconsin players.** In the Vault player, `index.html` (click to
  play) opens `iframe.html`, so `iframe.html`'s own referrer is `index.html`. `iframe.html` therefore reports the
  referrer `index.html` got (`https://vaultlearninggames.org/`) instead. PBS Wisconsin Education's "Play the game"
  popup plays in the Vault player too (since 2026-10-06; before, it opened `iframe.html` bare). The Vault player
  passes the site that sent it, `?vault_referrer=https://pbswisconsineducation.org/`, to the game; `index.html`
  forwards it and `iframe.html` reports it as the referrer, so PBS plays still show up as pbswisconsineducation.org. A GA4 tag must keep this, e.g. by passing `page_referrer` in its `config`.
- The cookie keeps `SameSite=None; Secure` (the game runs inside other sites' frames) and a 2-hour lifetime.

## Logging Events
Each log is sent with a number of fields required by [simplelog](https://github.com/fielddaylab/simplelog). Simple log allows for a custom field called event_data_complex along with its category enumerator:
  event_custom: category enumerator
  event_data_complex: JSON.stringify(log_data)
Each log_data is a JSON object for that specific category as defined below.
Note: Note: event_custom will always map to a string of the event name. For example, if an event called FOO had a field of "event_custom", its value would be a string "FOO". Not all events have this field.

#### Change Log
Versions:
1. Original
2. Restructured to flatten logging objects (which originally contained many sub-objects)
3. Simple log now sends player_id (if present) from the URL to log.php (9/24/2019)
4. Change name, type, and subtype to representitive strings instead of numbers (11/12/2019)
5. Intermediate Change. (11/26/2019)
6. Big Change. Will update readme later with all that has been changed (11/26/2019).
7. Add "script_type" and "script_version" to [startgame](#startgame) (7/22/2020).
8. Add "quiz_number" to [quiz](#quiz) (7/23/2020). Quiz questions subject to change, but now there is a quiz after each chapter end.
9. Add [quizquestion](#quizquestion) log (#22) (7/29/2020).
9. Add [quizstart](#quizstart) and [quizend](#quizend) logs (#23,#24) (8/03/2020).

### Event Categories
0. [checkpoint](#checkpoint)
1. [startgame](#startgame)
1. [endgame](#endgame)
1. [navigate_click](#navigate_click)
1. [notebook_click](#notebook_click)
1. [map_click](#map_click)
1. [notification_click](#notification_click)
1. [object_click](#object_click)
1. [observation_click](#observation_click)
1. [person_click](#person_click)
1. [cutscene_click](#cutscene_click)
1. [wildcard_click](#wildcard_click)
1. [navigate_hover](#navigate_hover)
1. [notebook_hover](#notebook_hover)
1. [map_hover](#map_hover)
1. [notification_hover](#notification_hover)
1. [object_hover](#object_hover)
1. [observation_hover](#observation_hover)
1. [person_hover](#person_hover)
1. [cutscene_hover](#cutscene_hover)
1. [wildcard_hover](#wildcard_hover)
1. [quiz](#quiz)
1. [quizquestion](#quizquestion)
1. [quizstart](#quizstart)
1. [quizend](#quizend)

### Enumerators and Constants
1. [Event Categories](#EventCategories)
1. [Log Types](#Types)
1. [Log Subtypes](#Subtypes)
1. [Log Names](#Names)
2. [Levels](#Levels)
3. [Interactions and Objectives](#InteractionsAndObjectives)
4. [Survey Questions](#SurveyQuestions)
5. [Survey Responses](#SurveyResponses)
6. [Script Types](#script_types)
7. [Script Versions](#script_versions)

### Generating Scripts
1. [Generating Scripts](#GeneratingScripts)

<a name="checkpoint"/>

#### checkpoint (index=0)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|name |event name | |
|level |enum for current checkpoint | |




<a name="startgame"/>

#### startgame (index=1)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|save_code | | |
|fullscreen | | |
|music | | |
|hq | | |
|script_type | enum of which script is being used. See [script_types](#script_types) for details and mappings from enum to type. |v7+ |
|script_version | Version of the script |v7+ |
|name |event name | |
|level |enum for current checkpoint | |




<a name="endgame"/>

#### endgame (index=2)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|name |event name | |
|level |enum for current checkpoint | |




<a name="navigate_click"/>

#### navigate_click (index=3)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|level |enum for current checkpoint | |




<a name="notebook_click"/>

#### notebook_click (index=4)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|page | | |
|level |enum for current checkpoint | |




<a name="map_click"/>

#### map_click (index=5)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|level |enum for current checkpoint | |




<a name="notification_click"/>

#### notification_click (index=6)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|level |enum for current checkpoint | |
|text_fqid |c.fqid|Text fqid (v6+)|
|text|c_text|Text  (v6+)|





<a name="object_click"/>

#### object_click (index=7)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|level |enum for current checkpoint | |




<a name="observation_click"/>

#### observation_click (index=8)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|level |enum for current checkpoint | |
|text_fqid |obs_fqid|Text fqid (v6+)|
|text|obs_text|Text  (v6+)|




<a name="person_click"/>

#### person_click (index=9)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|level |enum for current checkpoint | |
|text_fqid |speak.fqid|Text fqid (v6+)|
|text|speak_text| (v6+) |




<a name="cutscene_click"/>

#### cutscene_click (index=10)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|level |enum for current checkpoint | |
|text_fqid |cutscene.fqid|Text fqid (v6+)|
|text|txt| Either cutscene text or 'undefined' (v6+)|




<a name="wildcard_click"/>

#### wildcard_click (index=11)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|screen_coor |x,y integer array of where the mouse is in current room | |
|room_coor |x,y integer array of where the mouse is in the game screen | |
|name |event name | |
|level |enum for current checkpoint | |

|correct | correct answer to the problem (only exists for event name CHOICE) - sometimes doesn't exist?? | Only exists in versions 1-4. (v4-)|
|answer | selected answer (only exists for event name CHOICE) | Only exists in versions 1-4. (v4-)|
|cur_cmd_fqid| cmd_type == 1 ? cur_cmd.speak_fqid : wc.cur_command.entry_fqid|Only exists in versions 6+ (v6+)|
|cur_cmd_type|  cmd_type| Only exists in versions 6+ (v6+)|
|text|  cmd_txt| Only exists in versions 6+ (v6+)|
|name|  wc.cmd_type == 1 ? LOG_NAME_BASIC : LOG_NAME_CHOICE| Only exists in versions 6+ (v6+)|
|interacted_fqid|  clicked_fqid| Only exists in versions 6+ (v6+)|




<a name="navigate_hover"/>

#### navigate_hover (index=12)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|start_time |client side timestamp for the time the hover started | |
|end_time |client side timestamp for the time the hover ended | |
|name |event name | |
|level |enum for current checkpoint | |





<a name="notebook_hover"/>

#### notebook_hover (index=13)
| event Name | Description | Note |
| --- | --- | --- |




<a name="map_hover"/>

#### map_hover (index=14)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|start_time |client side timestamp for the time the hover started | |
|end_time |client side timestamp for the time the hover ended | |
|name |event name | |
|level |enum for current checkpoint | |




<a name="notification_hover"/>

#### notification_hover (index=15)
| event Name | Description | Note |
| --- | --- | --- |




<a name="object_hover"/>

#### object_hover (index=16)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|start_time |client side timestamp for the time the hover started | |
|end_time |client side timestamp for the time the hover ended | |
|level |enum for current checkpoint | |
|name |event name - sometimes doesn't exist?? | |




<a name="observation_hover"/>

#### observation_hover (index=17)
| event Name | Description | Note |
| --- | --- | --- |




<a name="person_hover"/>

#### person_hover (index=18)
| event Name | Description | Note |
| --- | --- | --- |




<a name="cutscene_hover"/>

#### cutscene_hover (index=19)
| event Name | Description | Note |
| --- | --- | --- |




<a name="wildcard_hover"/>

#### wildcard_hover (index=20)
| event Name | Description | Note |
| --- | --- | --- |
|room_fqid |fully qualified id of the room | |
|type |type name | |
|subtype |subtype name | |
|fqid |fqid of the interaction, with the room_fqid subtracted | |
|event_custom |event enum | |
|start_time |client side timestamp for the time the hover started | |
|end_time |client side timestamp for the time the hover ended | |
|name |event name - sometimes doesn't exist?? | |
|level |enum for current checkpoint | |
|correct | correct answer to the problem (only exists for event name CHOICE) - sometimes doesn't exist?? | Only exists in versions 1-4. (v4-)|
|answer |selected answer (only exists for event name CHOICE) | Only exists in versions 1-4. (v4-)|
|cur_cmd_fqid| cmd_type == 1 ? cur_cmd.speak_fqid : wc.cur_command.entry_fqid|Only exists in versions 6+ (v6+)|
|cur_cmd_type|  cmd_type| Only exists in versions 6+ (v6+)|
|text|  cmd_txt| Only exists in versions 6+ (v6+)|
|name|  wc.cmd_type == 1 ? LOG_NAME_BASIC : LOG_NAME_CHOICE| Only exists in versions 6+ (v6+)|
|interacted_fqid|  clicked_fqid| Only exists in versions 6+ (v6+)|

<a name="quiz"/>

#### quiz (index=21)
Only exists in logs v6+.
quiz_number only exists in logs v8+.
Replaced by quizquestion in v9+

| event Name | Description | Note |
| --- | --- | --- |
|room_fqid|fully qualified id of the room| |
|type|type enum| |
|subtype|subtype enum| |
|fqid|fqid of the interaction, with the room_fqid subtracted| |
|name|event name enum| |
|level|enum for current checkpoint| |
|event_custom|event enum| |
|questions|array of question objects, each has question, response, and response_index| |
|quiz_number|numerical id of the quiz sent (default startgame quiz is number 0) | |

<a name="quizquestion">

#### quizquestion (index=22)
Only exists in logs v9+.
Replaces quiz.

| event Name | Description | Note |
| --- | --- | --- |
|room_fqid|fully qualified id of the room| |
|type|type enum| |
|subtype|subtype enum| |
|fqid|fqid of the interaction, with the room_fqid subtracted| |
|name|event name enum| |
|level|enum for current checkpoint| |
|event_custom|event enum| |
|quiz_number|numerical id of the quiz sent | |
|question|ques.q|text of the question|
|question_index|question_index|index of the question within the quiz|
|response|ques.a\[ques.response]|question response text|
|response_index|ques.response|index of the response|

<a name="quizstart">


#### quizstart (index=23)
Only exists in logs v10+.
Logs when a player starts a given quiz.

| event Name | Description | Note |
| --- | --- | --- |
|room_fqid|fully qualified id of the room| |
|type|type enum| |
|subtype|subtype enum| |
|fqid|fqid of the interaction, with the room_fqid subtracted| |
|event_custom|event enum| |
|name|event name enum| |
|level|enum for current checkpoint| |
|quiz_number|numerical id of the quiz sent | |

<a name="quizend">


#### quizend (index=24)
Only exists in logs v10+.
Logs when a player ends a given quiz.

| event Name | Description | Note |
| --- | --- | --- |
|room_fqid|fully qualified id of the room| |
|type|type enum| |
|subtype|subtype enum| |
|fqid|fqid of the interaction, with the room_fqid subtracted| |
|event_custom|event enum| |
|name|event name enum| |
|level|enum for current checkpoint| |
|quiz_number|numerical id of the quiz sent | |


## Enumerators and Constants

<a name="EventCategories"/>

#### Event Categories 
| Index | Name | Description |
| --- | --- | --- | 
|0|checkpoint| |
|1|startgame| |
|2|endgame| |
|3|navigate_click| |
|4|notebook_click| |
|5|map_click| |
|6|notification_click| |
|7|object_click| |
|8|observation_click| |
|9|person_click| |
|10|cutscene_click| |
|11|wildcard_click| |
|12|navigate_hover| |
|13|notebook_hover| |
|14|map_hover| |
|15|notification_hover| |
|16|object_hover| |
|17|observation_hover| |
|18|person_hover| |
|19|cutscene_hover| |
|20|wildcard_hover| |
|21|quiz| |
|22|quizquestion| |
|23|quizstart| |
|24|quizend| |

<a name="Types"/>

#### Log Types 
| Index | Name | Description |
| --- | --- | --- | 
|0| checkpoint | |
|1| startgame |  |
|2| endgame |  |
|3| click |  |
|4| hover | |
|5| quiz| |
|6|quizquestion| |
|7|quizstart| |
|8|quizend| |

<a name="Subtypes"/>

#### Log Subtypes 
| Index | Name | Description |
| --- | --- | --- | 
|0| basic| |
|1| navigate| |
|2| notebook| |
|3| map| |
|4| notification| |
|5| object| |
|6| observation| |
|7| person  | |
|8| cutscene| |
|9| wildcard| |

<a name="Names"/>

#### Log Names 
| Index | Name | Description |
| --- | --- | --- | 
| 0 | basic  | |
| 1 | open  | |
| 2 | close | |
| 3 | choice| |
| 4 | next| |
| 5 | prev| |
  
<a name="Levels"/>
  
#### Levels
Jo Wilder data is organized into levels, where each level corresponds to a "save code"/chapter in the game.
  
| Index | Name |
| --- | --- |
|0|startgame|
|1|notebook|
|2|wiscwonders|
|3|mystery|
|4|plaque|
|5|notajersey|
|6|trashed|
|7|archivist|
|8|textile|
|9|logbook|
|10|suffragist|
|11|taxidermist|
|12|wellsdidit|
|13|saveteddy|
|14|scratches|
|15|hesalive|
|16|akey|
|17|rescued|
|18|backtowork|
|19|sadanimals|
|20|flaglady|
|21|ecologists|
|22|donethework|
|23|sunset|
  
<a name="InteractionsAndObjectives"/>
  
#### Interactions and Objectives
  
Many of the extracted features are based on individual [interactions](https://github.com/opengamedata/opengamedata-core/blob/master/games/JOWILDER/interaction_metadata.json) with the environment, or game [objectives](https://github.com/opengamedata/opengamedata-core/blob/master/games/JOWILDER/jo_wilder_fqid_to_enum.json). Linked here are JSON files mapping each interaction and objective to the index it will have in the resulting features data.

<a name="SurveyQuestions"/>
  
#### Survey
Players are given the following survey questions to answer throughout the game.

| Index | Question |
| --- | --- |
|0|What grade are you in?|
|1|How well do you read in English?|
|2|The game grabs my attention.|
|3|I like watching TV shows about history.|
|4|Jo is friendly.|
|5|I think the characters are funny.|
|6|The characters say things that make me laugh.|
|7|Time flies while I'm playing the game.|
|8|I like reading about history.|
|9|I like Jo.|
|10|Jo is kind.|
|11|The characters say funny things.|
|12|I forget what's around me while playing the game.|
|13|I like learning history very much.|
|14|I think learning history is fun.|
|15|I can relate to Jo.|
|16|The characters are entertaining.|
|17|I feel emotionally involved in the game.|

<a name="SurveyResponses"/>
  
#### Survey Responses
  
For question 0 ("What grade are you in?"):
| Index | Response |
| --- | --- |
|0|3rd|
|1|4th|
|2|5th|
|3|6th|
|4|Other|

For question 1 ("How well do you read in English?"):
| Index | Response |
| --- | --- |
|0|Not a very Good Reader|
|1|An OK Reader|
|2|Very Good Reader|

For remaining **EVEN**-indexed questions:
| Index | Response |
| --- | --- |
|0|Disagree|
|1|Somewhat Disagree|
|2|Neutral|
|3|Somewhat Agree|
|4|Agree|

For remaining **ODD**-indexed questions, responses are **reverse coded**:
| Index | Response |
| --- | --- |
|0|Agree|
|1|Somewhat Agree|
|2|Neutral|
|3|Somewhat Disagree|
|4|Disagree|

<a name="script_types"/>

#### Script Types
Starting in v7, multiple scripts were added to the game for AB tests on snark and humor. The game will randomly choose between 4 different data files: data_dry.js, data_nohumor.js, data_nosnark.js, and the original data.js. They are each built from their respective data folder in assets. The type of script used is only logged once, in [startgame](#startgame).

| Index | Name | Description |
| --- | --- | --- |
|0 | dry  | no humor or snark |
|1 | nohumor  |no humor (includes snark) |
|2 | nosnark  | no snark (includes humor). No snark can also be thought of as "obedient" |
|3 | normal | base script (includes snark and humor) |

<a name="script_versions"/>

#### Script Versions
Starting in v7. The version of script used is only logged once, in [startgame](#startgame). Different script types may have different versions, but for now they are all uniform.

| Version | Description |
| --- | --- |
|0 | Base game, all script types were the same as the original script (type 3: normal).  |
|1 | Changed the script for Chapter 1 to reflect the different types. Type 3 stays the same. |
|2 | Updated survey questions (8/26/2020). |
|3 | Changed the script of rest of chapters to reflect the different types (10/8/2020). |

<a name="GeneratingScripts"/>

### Generating Scripts

#### Configuring the Script Generator File
In `/engine`, edit the first few lines of `gen_data.sh` based on the script you want to edit:
1. original (data)
```
ENGINE_DD=../assets/data
GAME_DD=assets/data
STUB_D=stubs
OUT=data.js
```
2. no humor (nohumor)
```
ENGINE_DD=../assets/dataNoHumor
GAME_DD=assets/dataNoHumor
STUB_D=stubs
OUT=data_nohumor.js
```
3. no snark (nosnark)
```
ENGINE_DD=../assets/dataNoSnark
GAME_DD=assets/dataNoSnark
STUB_D=stubs
OUT=data_nosnark.js
```
4. no snark and no humor (dry)
```
ENGINE_DD=../assets/dataDry
GAME_DD=assets/dataDry
STUB_D=stubs
OUT=data_dry.js
```

#### Generating Script
1. In terminal, navigate to `/engine`.
1. Run `. quickgen.sh` (Windows users: run `sh quickgen.sh`). If you get an error about `\r` characters, run dos2unix on the erroring file and retry.
1. If generating the `nosnark`, `nohumor`, and `dry` versions, replace the code in `/src/data_nosnark`, `/src/data_nohumor`,  and `/src/data_dry` respectively:
```
tmp_animcycle = new animcycle();
tmp_animcycle.id = "notebook_baked";
tmp_animcycle.fqid = "tunic.notebook_baked";
{
tmp_animcycle.w = 0;
tmp_animcycle.h = 0;
tmp_animcycle.frame_t = 10;
tmp_animcycle.offset_t = 0;
tmp_animcycle.loop = 1;

tmp_animcycle.frame_files = [];
tmp_animcycle.frames = [];
tmp_animcycle.frame_files.push("assets/dataDry/levels/tunic/animcycles/notebook_baked/0.png");
}
tmp_level.animcycles.push(tmp_animcycle);
```
with
```
tmp_animcycle = new animcycle();
tmp_animcycle.id = "notebook_baked_no_monster";
tmp_animcycle.fqid = "tunic.notebook_baked_no_monster";
{
tmp_animcycle.w = 0;
tmp_animcycle.h = 0;
tmp_animcycle.frame_t = 10;
tmp_animcycle.offset_t = 0;
tmp_animcycle.loop = 1;

tmp_animcycle.frame_files = [];
tmp_animcycle.frames = [];
tmp_animcycle.frame_files.push("assets/dataDry/levels/tunic/animcycles/notebook_baked_no_monster/0.png");
}
tmp_level.animcycles.push(tmp_animcycle);
```
if necessary.

4. Optionally, delete any data files generated in the engine folder.
5. If you changed the script, please increment the versions of the script in `/src/log_events.js`, and add a comment of what the version changes. Also add similar documetation to `/README.md` in the `Script Versions` section.
