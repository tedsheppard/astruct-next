---
title: Boolean search syntax
summary: AND, OR, NOT, phrases, brackets, wildcards and proximity (w/N, NEAR/N, pre/N), with examples.
category: asking
order: 2
keywords: boolean search syntax operators and or not near w/n pre/n proximity wildcard phrase brackets query litigation
---
**Search** in the sidebar searches every document and email in a project that you are allowed to see. Switch between **Boolean** and **Plain English** above the results.

Boolean search finds exactly what you describe. It is the right choice when you know the words that were used.

## Operators at a glance

| You type | It finds |
|---|---|
| `crane outage` | Both words, anywhere in the document. Words side by side are joined with AND. |
| `crane AND outage` | Both words, anywhere in the document. |
| `crane OR hoist` | Either word. |
| `crane NOT Stratford` | *crane*, but not in documents that mention *Stratford*. |
| `"slab edge"` | The exact phrase. |
| `(crane OR hoist) AND delay` | Brackets group terms, so the OR is worked out first. |
| `bracket*` | Any word starting *bracket*: bracket, brackets, bracketry. |
| `crane w/5 delay` | *crane* within 5 words of *delay*, in either order. |
| `crane NEAR/5 delay` | The same as w/5, for people used to other search tools. |
| `notice pre/3 delay` | *notice* coming before *delay*, within 3 words. |

Write the operators AND, OR, NOT, w/, NEAR/ and pre/ in capitals or as shown. Search terms are not case sensitive.

## Examples

**A direction that changed the brackets**

```
bracket* w/5 ("slab edge" OR anchor*) AND "Rev C"
```

**Anything that might be a delay notice**

```
("delay notice" OR "notice of delay" OR "extension of time") NOT "meeting time"
```

**The head contractor saying there is no change to the price**

```
"no change" pre/4 ("subcontract sum" OR "contract sum" OR price)
```

**A crane or hoist problem close to a date**

```
(crane OR TC1 OR hoist) w/10 ("out of service" OR breakdown OR cancelled)
```

**RFIs about slab edge distances**

```
RFI* AND "slab edge" w/8 (distance OR thickness OR "150 mm")
```

## Tips

- Use brackets whenever you mix AND with OR. It makes the query read the way you mean it.
- Put a wildcard at the end of a word, not the start: `variat*` finds *variation* and *variations*.
- Start broad, then add NOT to remove noise, such as a subcontractor with a similar name.
- If a Boolean search finds nothing, try the same question in **Plain English**. See [Plain-English search](/support/plain-english-search).

Every result shows the page it was found on. See [Page references](/support/page-references).
