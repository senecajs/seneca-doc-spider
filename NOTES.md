# Notes

## Referral Programme Articles

- https://growsurf.com/blog/b2c-subscription-referral-marketing
- https://blog.hubspot.com/service/customer-referral-program
- https://userguiding.com/blog/saas-referral-programs/

# Vanity URL example

- https://thisweekinstartups.com/
  - https://thisweekinstartups.com/vanta

## Entities

As per Seneca convention, plurals are _not_ used.

### sys/user

From @seneca/user - direct entity access.

Assumes fields:

- id

### file-spider/entry

The main table.
A referral from a user to an invitee.

Does _not_ store state. To allow for more flexible business rules, referral "state" is
determined by child rows in file-spider/occur

Parent: file-spider/point
Child: file-spider/occur

### file-spider/occur

An event in the referal process. Used instead of a single "state" on file-spider/entry
Not called "event" to avoid conflicts.

Triggers various external actions - sending email, rewards etc.

Parent: file-spider/entry

### file-spider/rule

Defined action triggers for rows in file-spider/occur
Actual actions are app specific - encoded by messages

### file-spider/reward

Track user "rewards" wrt referrals, such as # of referrals, kind of "points"

### file-spider/point

Referral entry point; link or code; many inbound users
Vanity urls, etc.

Child: file-spider/entry
