---
type: llm
focus: trace
weight: 1
---

In PriceList.jsx, every Intl-formatted currency amount (price, discount, total) is rendered inside a <bdi> or an element with dir="auto", and none of them is inside an element with dir="ltr".
