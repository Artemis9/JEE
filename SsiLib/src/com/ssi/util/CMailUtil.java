package com.ssi.util;

import javax.mail.*;
import javax.mail.internet.*;


import java.util.*;

/**
 * TextEmail defines utility methods for the JavaMail API, which provides
 * a platform independent and protocol independent framework to build Java
 * technology-based mail and messaging applications.
 */
public class CMailUtil {
    private static final String SMTP = "smtp";
    private static final String MAIL_TRANSPORT_PROTOCOL = "mail.transport.protocol";
    private static final String MAIL_SMTP_HOST = "mail.smtp.host";
    private static final String MAIL_SMTP_PORT = "mail.smtp.port";
    private static final String MAIL_DEBUG = "mail.debug";
/*
    private static final String SENDER_ERROR_MSG = "Sender is null or empty";
    private static final String SUBJECT_ERROR_MSG = "Subject is null or empty";
    private static final String BODY_ERROR_MSG = "Body is null or empty";
    private static final String RECIPIENT_ERROR_MSG = "Recipient is null or empty";
    private static final String RECIPIENTS_ERROR_MSG = "Recipient List is null or empty";
    private static final String CC_RECIPIENT_ERROR_MSG = "CC Recipient is null or empty";
    private static final String CC_RECIPIENTS_ERROR_MSG = "CC Recipient List is null or empty";
    private static final String BCC_RECIPIENT_ERROR_MSG = "BCC Recipient is null or empty";
    private static final String BCC_RECIPIENTS_ERROR_MSG = "BCC Recipient List is null or empty";
    private static final String SENT_DATE_ERROR_MSG = "Sent Date is null";

    private static final String MAIL_SMTP_HOST_ERROR_MSG = "SMTP Host name is null or empty";
*/
    private static final String INVALID_ADDRESS_MSG = "Email Address does not conform to RFC 822 standard";

    private Session session;
    private InternetAddress sender = new InternetAddress();
    private String subject = new String();
    private StringBuffer body = new StringBuffer();
    private List recipients = new ArrayList();
    private List ccRecipients = new ArrayList();
    private List bccRecipients = new ArrayList();
    private Date sentDate;

    public CMailUtil() throws CEmailException {
        setSession(getDefaultSession());
    }

    public CMailUtil(Session session) throws CEmailException {
        setSession(session);
    }

    public CMailUtil(String sender, String subject, String body, List recipients) throws CEmailException {
        this();
        setSender(sender);
        setSubject(subject);
        setBody(body);
        setRecipients(recipients);
    }

    public CMailUtil(String sender, String subject, String body,
                     List recipients, List ccRecipients) throws CEmailException {
        this(sender, subject, body, recipients);
        setCcRecipients(ccRecipients);
    }

    public String getSender() {
        return sender.toString();
    }

    public void setSender(String sender) throws CEmailException {
        this.sender = CMailUtil.makeInternetAddress(sender);
    }

    private static InternetAddress makeInternetAddress(String emailAddress) throws CEmailException {
        InternetAddress internetAddress = null;

        try {
            internetAddress = new InternetAddress(emailAddress);
            internetAddress.validate();
        } catch (AddressException ae) {
            throw new CEmailException(CMailUtil.INVALID_ADDRESS_MSG + " " + emailAddress + ":\n" + ae);
        }

        return internetAddress;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body.toString();
    }

    public void setBody(String body) throws IllegalArgumentException {
        this.body = new StringBuffer(body);
    }

    public List getRecipients() {
        return CMailUtil.internetAddressesToStrings(recipients);
    }

    /**
     * @return
     */
    private static List internetAddressesToStrings(List internetAddressRecipients) {
        List stringRecipients = new ArrayList();
        Iterator internetAddressRecipientsIter = internetAddressRecipients.iterator();

        while (internetAddressRecipientsIter.hasNext()) {
            InternetAddress internetAddress = (InternetAddress) internetAddressRecipientsIter.next();

            stringRecipients.add(internetAddress.toString());
        }

        return stringRecipients;
    }

    public void addRecipient(String recipient) throws CEmailException {
        recipients.add(CMailUtil.makeInternetAddress(recipient));
    }

    public void setRecipients(List recipients) throws CEmailException {
        CMailUtil.setRecipients(this.recipients, recipients);
    }

    private static void setRecipients(List dest, List src) throws CEmailException {
        dest.clear();

        dest.addAll(CMailUtil.stringsToInternetAddresses(src));
    }

    /**
     * @return
     * @throws CEmailException
     */
    private static List stringsToInternetAddresses(List stringRecipients) throws CEmailException {
        List internetAddressRecipients = new ArrayList();
        Iterator stringRecipientsIter = stringRecipients.iterator();

        while (stringRecipientsIter.hasNext()) {
            String address = (String) stringRecipientsIter.next();

            internetAddressRecipients.add(CMailUtil.makeInternetAddress(address));
        }

        return internetAddressRecipients;
    }

    public List getCcRecipients() {
        return CMailUtil.internetAddressesToStrings(ccRecipients);
    }

    public void addCcRecipient(String recipient) throws CEmailException {
        ccRecipients.add(CMailUtil.makeInternetAddress(recipient));
    }

    public void setCcRecipients(List ccRecipients) throws CEmailException {
        CMailUtil.setRecipients(this.ccRecipients, ccRecipients);
    }

    public boolean hasCcRecipients() {
        return (ccRecipients != null && !ccRecipients.isEmpty());
    }
    public List getBccRecipients() {
        return CMailUtil.internetAddressesToStrings(bccRecipients);
    }

    public void addBccRecipient(String recipient) throws CEmailException {
        bccRecipients.add(CMailUtil.makeInternetAddress(recipient));
    }

    public void setBccRecipients(List bccRecipients) throws CEmailException {
        CMailUtil.setRecipients(this.bccRecipients, bccRecipients);
    }

    public boolean hasBccRecipients() {
        return (bccRecipients != null && !bccRecipients.isEmpty());
    }

    public void setSentDate(Date sentDate) throws IllegalArgumentException {
        this.sentDate = sentDate;
    }

    public Date getSentDate() {
        if (sentDate == null) {
            sentDate = new Date();
        }

        return sentDate;
    }

    private Session getDefaultSession() throws CEmailException {
        Properties props = new Properties(),
                   sysProps = System.getProperties();

        String mailSmtpHost = sysProps.getProperty(CMailUtil.MAIL_SMTP_HOST),
                 mailSmtpPort = sysProps.getProperty(CMailUtil.MAIL_SMTP_PORT),
                 mailDebug = sysProps.getProperty(CMailUtil.MAIL_DEBUG, "false");

        props.setProperty(CMailUtil.MAIL_TRANSPORT_PROTOCOL, SMTP);
        props.setProperty(CMailUtil.MAIL_SMTP_HOST, mailSmtpPort);

        props.setProperty(CMailUtil.MAIL_SMTP_HOST, mailSmtpHost);
        props.setProperty(CMailUtil.MAIL_DEBUG, mailDebug);

        // Get the default Session using Properties.
        Session session = Session.getDefaultInstance(props);

        return session;
    }

    /**
     * @return Returns the session.
     */
    public Session getSession() {
        return session;
    }

    /**
     * @param session The session to set.
     */
    public void setSession(Session session) {
        this.session = session;
    }

    /**
     * This method sends an email message using the JavaMail API.
     *
     * @param mailMessage The email message to send.
     */
    public void send() throws CEmailException {

        try {
            InternetAddress[] recipientsArr = (InternetAddress[]) recipients.toArray(new InternetAddress[0]);

            // Create a New message.

            MimeMessage msg = new MimeMessage(session);

            // Set the "From" address.

            //msg.setFrom(sender);

            // Set the "To recipients" addresses.

            msg.setRecipients(Message.RecipientType.TO, recipientsArr);

            if (hasCcRecipients()) {
                InternetAddress[] ccRecipientsArr = (InternetAddress[]) ccRecipients.toArray(new InternetAddress[0]);

                // Cc Recipients are optional.
                // Set the "Cc recipients" addresses.

                msg.setRecipients(Message.RecipientType.CC, ccRecipientsArr);
            }

            if (hasBccRecipients()) {
                InternetAddress[] bccRecipientsArr = (InternetAddress[])
                                  bccRecipients.toArray(new InternetAddress[0]);

                // Bcc Recipients are optional.
                // Set the "Bcc recipients" addresses.

                msg.setRecipients(Message.RecipientType.BCC, bccRecipientsArr);
            }

            // Set the Subject.

            msg.setSubject(subject);

            // Set the Text.

            msg.setText(body.toString());

            // Set the sent date.

            msg.setSentDate(getSentDate());

            // Send the message.

            Transport.send(msg);
        } catch (MessagingException me) {
            throw new CEmailException(me);
        }
    }

}
