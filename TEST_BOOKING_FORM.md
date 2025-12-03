# 🧪 Test the Updated Booking Form

## 🚀 Quick Start

### **1. Start the Development Server**
```bash
npm run dev
```

### **2. Navigate to Room Details Page**
- Go to the website
- Click on any room (e.g., from "Find Rooms" or "Our Rooms" section)
- You'll be taken to the Room Details page

### **3. Test the Booking Form**

You should see a booking form on the right sidebar with:

#### ✅ **Check-In Date Field**
- Click on the date picker
- Select a date (today or future)
- Verify you cannot select past dates

#### ✅ **Check-Out Date Field**
- Click on the date picker
- Select a date after check-in
- Verify minimum date is check-in date

#### ✅ **Number of Rooms**
- Click the **+** button to increase
- Click the **-** button to decrease
- Verify it doesn't go below 1

#### ✅ **Adults**
- Click the **+** button to increase
- Click the **-** button to decrease
- Verify it doesn't go below 1

#### ✅ **Children**
- Click the **+** button to increase
- Click the **-** button to decrease
- Verify it can go to 0

---

## 🧪 Test Scenarios

### **Test 1: Empty Form Submission**
1. Don't fill any dates
2. Click "Book Now"
3. ✅ Should show warning: "Please select check-in and check-out dates"

### **Test 2: Only Check-In Selected**
1. Select check-in date only
2. Click "Book Now"
3. ✅ Should show warning: "Please select check-in and check-out dates"

### **Test 3: Complete Booking**
1. Select check-in date (e.g., tomorrow)
2. Select check-out date (e.g., 3 days later)
3. Adjust rooms to 2
4. Adjust adults to 3
5. Adjust children to 1
6. Click "Book Now"
7. ✅ Should show booking summary popup with all details
8. Click "Confirm Booking"
9. ✅ Should show success message
10. ✅ Should redirect to home page

### **Test 4: Cancel Booking**
1. Fill all form fields
2. Click "Book Now"
3. See booking summary
4. Click "Cancel"
5. ✅ Should close popup and stay on page

### **Test 5: Adjust Values**
1. Set rooms to 5 (click + multiple times)
2. Set adults to 10
3. Set children to 5
4. ✅ All values should update correctly
5. Click - buttons
6. ✅ Values should decrease
7. ✅ Rooms and Adults should stop at 1
8. ✅ Children should stop at 0

---

## 🎨 Visual Checks

### **Colors:**
- ✅ +/- buttons should be green (#006938)
- ✅ Hover should be darker green (#004d27)
- ✅ "Book Now" button should be green
- ✅ Focus border on date inputs should be green

### **Responsiveness:**
- ✅ Test on mobile (narrow screen)
- ✅ Test on tablet (medium screen)
- ✅ Test on desktop (wide screen)
- ✅ Form should adapt to all sizes

### **Dark Mode:**
- ✅ Toggle dark mode
- ✅ Form should be readable
- ✅ Inputs should have proper contrast

---

## 🔍 Browser Console Check

After clicking "Book Now" and confirming:
1. Open browser console (F12)
2. Look for: `Booking Data: { ... }`
3. ✅ Should show all form values:
   ```javascript
   {
     room: { ... },
     checkInDate: "2025-03-20",
     checkOutDate: "2025-03-23",
     rooms: 2,
     adults: 3,
     children: 1
   }
   ```

---

## ✅ Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| Load page | Form fields are empty/default |
| Select check-in | Date picker opens, can select date |
| Select check-out | Minimum date is check-in date |
| Click + on rooms | Number increases |
| Click - on rooms | Number decreases (min 1) |
| Click + on adults | Number increases |
| Click - on adults | Number decreases (min 1) |
| Click + on children | Number increases |
| Click - on children | Number decreases (min 0) |
| Click "Book Now" (empty) | Warning message |
| Click "Book Now" (filled) | Booking summary popup |
| Confirm booking | Success message + redirect |
| Cancel booking | Popup closes |

---

## 🐛 Troubleshooting

### **Issue: Date picker not working**
- Check browser compatibility
- Try Chrome/Firefox/Edge

### **Issue: +/- buttons not working**
- Check browser console for errors
- Refresh the page

### **Issue: Form not visible**
- Scroll down on the room details page
- Check if you're on the correct page

### **Issue: Validation not working**
- Make sure both dates are empty
- Try clicking "Book Now" without filling anything

---

## 📝 Notes

- The form now starts **empty** - customers must fill it
- Dates are **required** - validation prevents empty submission
- All values are **adjustable** - full customer control
- Booking data is **logged to console** - ready for database integration

---

## 🎉 Success Criteria

The booking form is working correctly if:
- ✅ All fields are empty/default on page load
- ✅ Customers can select their own dates
- ✅ Customers can adjust rooms, adults, children
- ✅ Validation prevents incomplete bookings
- ✅ Booking summary shows all details
- ✅ Success message appears after confirmation
- ✅ Form is responsive and looks good
- ✅ Brand colors are applied correctly

**If all checks pass, the booking form is ready for online bookings!** 🚀

