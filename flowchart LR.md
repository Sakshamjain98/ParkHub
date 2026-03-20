flowchart LR
  Customer((Customer))
  Manager((Manager))
  Valet((Valet))
  Admin((Admin))

  UC1[Search Garages]
  UC2[Create Booking]
  UC3[Pay via Stripe]
  UC4[Track Booking Status]
  UC5[Create Garage and Slots]
  UC6[Manage Valets]
  UC7[View Company Bookings]
  UC8[Pick Up Vehicle]
  UC9[Drop/Return Vehicle]
  UC10[Verify Garage]

  Customer --> UC1
  Customer --> UC2
  Customer --> UC3
  Customer --> UC4

  Manager --> UC5
  Manager --> UC6
  Manager --> UC7

  Valet --> UC8
  Valet --> UC9

  Admin --> UC10