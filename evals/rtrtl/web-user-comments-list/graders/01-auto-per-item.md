---
type: llm
focus: trace
weight: 1
---

In CommentsList.jsx, each comment's text element (or each comment item) has dir="auto" or is a <bdi>; direction is not set only once with dir="auto" on the list or wrapper around all comments.
