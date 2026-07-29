const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a slug for the new guide (e.g., node scripts/create-guide.js traveling-with-pets)");
  process.exit(1);
}

const slug = args[0].toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
const filePath = path.join(__dirname, '..', 'src', 'data', 'articles', `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Error: Guide '${slug}.md' already exists!`);
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];

const template = `---
title: "The Ultimate Guide to Traveling With [Topic]"
description: "Everything you need to know about packing [Topic] under official TSA and FAA regulations."
category: "Uncategorized"
lastUpdated: "${today}"
isMedical: false
isLegal: false
---

[Introduction: 150-200 words explaining the importance of understanding the rules for this specific topic before arriving at the airport checkpoint.]

---

## TSA Rules Summary

[Provide a high-level summary of the carry-on vs. checked baggage rules for this category of items.]

- **Carry-On Baggage (Cabin):** [Allowed / Prohibited / Restricted]
- **Checked Baggage (Hold):** [Allowed / Prohibited / Restricted]
- **TSA Declaration Required:** [Yes / No]

---

## Official Regulations

[Deep dive into the specific wording and requirements from the TSA, FAA, or CBP regarding this item. Minimum 300 words.]

> [!IMPORTANT]
> Always verify with your specific airline, as individual carrier policies may be stricter than federal TSA regulations.

---

## Essential Traveler Tips

[Actionable advice on how to pack, declare, and transport these items safely through security.]

1. **Tip 1:** 
2. **Tip 2:** 
3. **Tip 3:** 

---

## Common Mistakes to Avoid

[List 2-3 frequent errors passengers make that result in item confiscation or security delays.]

- **Mistake 1:** 
- **Mistake 2:** 

---

## Frequently Asked Questions

**Q: [Common question 1]?**
A: [Answer]

**Q: [Common question 2]?**
A: [Answer]

---

## Conclusion

[Final wrap-up paragraph summarizing the key takeaways for travelers.]

---

## Official References

- [TSA Official Guidelines](https://www.tsa.gov/)
- [FAA Dangerous Goods Safety](https://www.faa.gov/)
`;

fs.writeFileSync(filePath, template, 'utf8');
console.log(`✅ Success! Created new guide template at: src/data/articles/${slug}.md`);
console.log(`Open the file to begin writing your 1,500+ word editorial guide.`);
