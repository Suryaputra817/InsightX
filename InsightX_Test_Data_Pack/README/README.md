# InsightX Test Data Pack

This pack contains synthetic datasets designed to exercise the InsightX upload -> validation -> preprocessing -> ML -> investigation flow.

## Datasets

1. Walmart_Retail/walmart_style_business.csv / .xlsx
   - 5,000 synthetic retail transactions
   - date, region, product, customer_segment, shipping_mode, orders, revenue, profit, shipping_cost, delivery_delay_days, complaints, market_index
   - Includes an intentionally injected North-region delivery/revenue stress pattern in Apr-May 2026.

2. IBM_Telco_Churn/telco_style_churn.csv / .xlsx
   - 7,043 synthetic telco-style customer records.
   - Churn classification target plus interpretable service/account features.
   - Inspired by the public IBM Telco sample schema, but contains generated values and is NOT IBM customer data.

## Important
These files are synthetic test data. They are suitable for testing the InsightX application, not for claiming that the observations are actual company performance.

## Suggested tests
- Upload Walmart CSV: test anomaly/driver analysis.
- Upload Walmart XLSX: test Excel parsing.
- Upload Telco CSV: test classification and feature importance.
- Modify/remove a required column: test schema validation.
- Upload a tiny file: test insufficient-data handling.
