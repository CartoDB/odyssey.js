# Odyssey.js sports template

This template is intended to be used for visualizing sports events, making use of [Odyssey.js](https://github.com/CartoDB/odyssey.js) and the [CartoDB Editor](http://cartodb.com/).

## Example

- **Ohio State vs. Oregon (Football)**  
http://cartodb.github.io/odyssey.js/examples/sports/dist/?vis=628c2b32-9ae7-11e4-b88e-0e4fddd5de28&utn=matallo,ohio_state_vs_oregon&t=Ohio%20State,F11810%7COregon,229A00

## Create a new story

If you're familiar with Odyssey, you'll know every story is composed of chapters. Instead of using the [Odyssey.js Sandbox](http://cartodb.github.io/odyssey.js/sandbox/sandbox.html) to write the chapters of your story, we'll use the [CartoDB Editor](http://cartodb.com/).

On one hand we'll create a Torque visualization with our data, and get the UUID of the visualization as our first parameter of the URL.

We'll use as an example the visualization **@CFBPlayoff National Championship on @ESPN: #UOvsOSU** from the user [srogers](https://srogers.cartodb.com/)

```
?vis=628c2b32-9ae7-11e4-b88e-0e4fddd5de28
```

You can find the UUID directly in the address bar, or by clicking the _Share_ button on the top right of your CartoDB visualization.

The title of the visualization in CartoDB will appear as the title in our template.

On the other hand you'll need a table to publish the data, with several columns in it. You can use [the next table](https://team.cartodb.com/u/matallo/tables/odyssey_sports_template/table) as a template and fill the columns:

- **odyssey_actions** 
The Odyssey actions between _Fenced code blocks_. I.e.: `zoom, center, play, pause, sleep`, ... See the [Odyssey torque template](http://cartodb.github.io/odyssey.js/sandbox/sandbox.html#md/torque/YGBgCi10aXRsZTogIlRpdGxlIgotYXV0aG9yOiAiT2R5c3NleS5qcyBEZXZlbG9wZXJzIgotdml6anNvbjogImh0dHA6Ly92aXoyLmNhcnRvZGIuY29tL2FwaS92Mi92aXovNTIxZjM3NjgtZWIzYy0xMWUzLWI0NTYtMGUxMGJjZDkxYzJiL3Zpei5qc29uIgotZHVyYXRpb246IDE4CmBgYAoKIyBUb3JxdWUgVGVtcGxhdGUKYGBgCi0gc3RlcDogMAotIGNlbnRlcjogWy00LjAzOTYsIDUuNTM3MV0KLSB6b29tOiAyCmBgYAoKIyMgQW5pbWF0ZWQgbWFwcyBpbiBPZHlzc2V5LmpzCgpEZWxldGUgdGhlIFtNYXJrZG93bl0oaHR0cDovL2RhcmluZ2ZpcmViYWxsLm5ldC9wcm9qZWN0cy9tYXJrZG93bi8pIHRvIGdldCBzdGFydGVkIHdpdGggeW91ciBvd24gb3Igd2F0Y2ggdGhpcyBzdG9yeSB0byBsZWFybiBzb21lIG9mIHRoZSB0ZWNobmlxdWVzLgoKIyB2aXpqc29uCmBgYAotc3RlcDogMzAKUy50b3JxdWVMYXllci5hY3Rpb25zLnBhdXNlKCkKTy5BY3Rpb25zLlNsZWVwKDMwMDApClMudG9ycXVlTGF5ZXIuYWN0aW9ucy5wbGF5KCkKYGBgCgpVbmxpa2Ugb3RoZXIgT2R5c3NleS5qcyB0ZW1wbGF0ZXMsIHRoZSBUb3JxdWUgdGVtcGxhdGUgcmVxdXJlcyBhIFZpei5KU09OIFVSTCB0byBhZGQgYW4gYW5pbWF0ZWQgbGF5ZXIgdG8geW91ciBtYXAuIFlvdSBjYW4gZmluZCBvdXQgbW9yZSBhYm91dCBWaXouSlNPTiBVUkxzIFtoZXJlXShodHRwOi8vZGV2ZWxvcGVycy5jYXJ0b2RiLmNvbS9kb2N1bWVudGF0aW9uL3VzaW5nLWNhcnRvZGIuaHRtbCNzZWMtOCkKClRvIGFkZCB5b3VyIG93biwganVzdCByZXBsYWNlIHRoZSBhYm92ZSBsaW5rIHNvIGl0IGxvb2tzIGxpa2UsCgoqKi12aXpqc29uOiAiaHR0cDovL3lvdXItdXJsL3Zpei5qc29uIioqCgoKIyBNYXJrZG93bgpgYGAKLXN0ZXA6IDYwClMudG9ycXVlTGF5ZXIuYWN0aW9ucy5wYXVzZSgpCk8uQWN0aW9ucy5TbGVlcCgzMDAwKQpTLnRvcnF1ZUxheWVyLmFjdGlvbnMucGxheSgpCmBgYAoKTGlrZSBhbGwgdGVtcGxhdGVzLCB0aGUgVG9ycXVlIHRlbXBsYXRlIHJ1bnMgb24gW01hcmtkb3duXShodHRwOi8vZGFyaW5nZmlyZWJhbGwubmV0L3Byb2plY3RzL21hcmtkb3duLykuIFRoaXMgZ2l2ZXMgeW91IHRoZSBhYmlsaXR5IHRvIGNyZWF0ZSBjb21wbGV0ZWx5IGN1c3RvbSBjb250ZW50IGZvciB5b3VyIHN0b3J5CgojIENoYW5nZSBtYXAgcG9zaXRpb24gCmBgYAotIHN0ZXA6IDExMQotIGNlbnRlcjogWzUwLjI2MTMsIC0yLjEzMTNdCi0gem9vbTogNQpTLnRvcnF1ZUxheWVyLmFjdGlvbnMucGF1c2UoKQpPLkFjdGlvbnMuU2xlZXAoMzAwMCkKUy50b3JxdWVMYXllci5hY3Rpb25zLnBsYXkoKQpgYGAKCllvdSBjYW4gdG91ciB0aGUgbWFwIGJ5OgoKMS4gQWRkIGEgbmV3IHNlY3Rpb24gdXNpbmcgdGhlIGhlYWRsaW5lIG5vdGF0aW9uLCAqKiMqKgoyLiBQYXVzZSB0aGUgc2xpZGVyIGFuZCBtb3ZlIGl0IHRvIHRoZSBkZXNpcmVkIHRpbWUgaW4geW91ciBtYXAgdmlzdWFsaXphdGlvbi4KMy4gQmVzaWRlIHlvdXIgbmV3IGhlYWRsaW5lLCBjbGljayBBZGQgYW5kIHRoZW4gKippbnNlcnQgdGltZSoqCjQuIE1vdmUgeW91ciBtYXAgdG8geW91ciBkZXNpcmVkIGxvY2F0aW9uLCBhbmQgY2xpY2sgIm1vdmUgbWFwIHRvIGN1cnJlbnQgcG9zaXRpb24iCgojIFBhdXNlIHlvdXIgbWFwCmBgYAotIHN0ZXA6IDI5MgotIGNlbnRlcjogWzkuNDE2NSwgLTc5LjI4MjhdCi0gem9vbTogNwpTLnRvcnF1ZUxheWVyLmFjdGlvbnMucGF1c2UoKQpPLkFjdGlvbnMuU2xlZXAoMjAwMCkKUy50b3JxdWVMYXllci5hY3Rpb25zLnBsYXkoKQpgYGAKCklmIHlvdSB3YW50IHRvIGhpZ2hsaWdodCBhIHBhcnRpY3VsYXIgbW9tZW50IGluIHRpbWUsIGl0IGlzIGhlbHBmdWwgdG8gdXNlIGEgUGF1c2UsIFNsZWVwLCBQbGF5IHNlcmllcyBvZiBldmVudHMgbGlrZSB0aGlzIHNsaWRlLiAK) for more reference.

- **event_type** 
The kind of event: `score, or slide`

"Slide" are for those with slide panel event in the top right, "score" is for a update in the score.

In case of "slide", **slide_panel_title** and **slide_panel_content_md** (this column accepts markdown) columns will be needed too.

In case of "score", **score_panel** and **team_id** will be needed, too. The content in **score_panel** will update the scoreboard for the corresponding team in the **team_id** column. 

- **event_icon_url** 
The url of the icon that will appear in the timeline. They must be 20x20px.

- **date** 
The date and time at wich the events will take place.

- **tooltip_title** 
The title in the tooltips (for every event).

- **visible** 
Visibility of the event in the timeline (`true or false`). Events will still occur even if they won't appear in the timeline. 

Write down the username and the table name of the table and add them to the URL params. For example https://team.cartodb.com/u/matallo/tables/ohio_state_vs_oregon/table

```
&utn=matallo,ohio_state_vs_oregon
```

Finally, for the match teams name and colors, we'll write them directly in the URL params separated by commas:

```
&t=Ohio%20State,F11810%7COregon,229A00
```
