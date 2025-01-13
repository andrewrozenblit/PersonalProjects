Andrew Rozenblit 

Using Python and Scapy, I wrote a program named alarm.py that provides a user the 
option to analyze a live stream of network packets or a set of PCAPs for 
incidents. My tool is be able to analyze for the following incidents:

- NULL scan
- FIN scan
- Xmas scan
- Usernames and passwords sent in-the-clear via HTTP Basic Authentication, FTP, and IMAP
- Nikto scan
- Someone scanning for Server Message Block (SMB) protocol
- Someone scanning for Remote Desktop Protocol (RDP)
- Someone scanning for Virtual Network Computing (VNC) instance(s)

If an incident is detected, alert must be displayed in the format:

  ALERT #{incident_number}: #{incident} is detected from #{source IP address} 
  (#{protocol or port number}) (#{payload})!

Example outputs: 
  ALERT #1: Xmas scan is detected from 192.168.1.3 (TCP)! ALERT #2: Usernames 
  and passwords sent in-the-clear (HTTP) (username:batman, password:brucewayne)



 -----------------------------------------------------------------------------

All aspects should function properly. However, when compared to wireshark
the implementation misses a few of the packets. 

I would add a packet capturer feature, so that the program may be rerun on  
the captured packets to recheck how many and which alerts were triggered.



