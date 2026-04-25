/**
 * Savannah Luxe Email Engine
 * Generates high-fidelity, branded HTML emails for Asili Yetu Safaris.
 */

const accentColor = '#D4AF37'; // Savannah Gold
const bgColor = '#FAFAFA';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// In dev, localhost isn't reachable by emails, so we use a high-fidelity branded fallback
const logoImg = siteUrl.includes('localhost') 
    ? 'https://raw.githubusercontent.com/Aura-droid/asili-yetu/main/public/brand/text-brand-no-bg.png' 
    : `${siteUrl}/brand/text-brand-no-bg.png`;

const markImg = siteUrl.includes('localhost')
    ? 'https://raw.githubusercontent.com/Aura-droid/asili-yetu/main/public/brand/logo-mark-no-bg.png'
    : `${siteUrl}/brand/logo-mark-no-bg.png`;

export const safariEmailTemplate = (clientName: string, itineraryTitle: string, status: string, customMessage?: string, accessToken?: string, locale: string = 'en', btnText?: string, payload?: any) => {
    const bannerImg = `https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200`;
    const portalUrl = accessToken ? `${siteUrl}/${locale}/portal/${accessToken}` : siteUrl;
    const messageContent = customMessage || `The wilderness is calling. Your customized safari profile has been successfully initialized in our command center. Our concierge team has updated your safari status to: ${status.replace('_', ' ').toUpperCase()}.`;

    return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${bgColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eeeeee;">
            <div style="width: 100%; height: 260px; overflow: hidden; position: relative; background-color: #1a1a1a;">
                <img src="${bannerImg}" style="width: 100%; height: 100%; object-fit: cover;" alt="Asili Yetu Safari" />
            </div>
            <div style="padding: 40px; text-align: left; position: relative; z-index: 10; margin-top: -100px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 38px; font-weight: 900; letter-spacing: -2px; text-transform: uppercase; font-style: italic; text-shadow: 2px 2px 10px rgba(0,0,0,0.8);">Asili Yetu</h1>
                <p style="color: ${accentColor}; font-weight: 800; margin-top: 5px; letter-spacing: 3px; text-transform: uppercase; font-size: 11px; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">Private Safaris & Expeditions</p>
            </div>
            <div style="padding: 40px; padding-top: 20px;">
                <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.5px;">Jambo, ${clientName}!</h2>
                <div style="color: #555555; line-height: 1.7; font-size: 15px; margin-bottom: 25px;">${messageContent}</div>
                
                <div style="background: ${bgColor}; border-radius: 20px; padding: 28px; border-left: 6px solid ${accentColor}; margin: 35px 0;">
                    <span style="font-size: 10px; font-weight: 900; color: #999999; text-transform: uppercase; display: block; margin-bottom: 6px; letter-spacing: 2px;">Active Expedition Suggestion</span>
                    <h3 style="font-size: 20px; font-weight: 900; color: #1a1a1a; margin: 0; letter-spacing: -0.5px;">${itineraryTitle}</h3>
                </div>

                ${payload?.itinerary?.dailyBreakdown ? `
                <div style="margin-top: 40px; padding-top: 35px; border-top: 2px solid #f0f0f0;">
                    <h3 style="font-size: 20px; font-weight: 900; color: #1a1a1a; margin-bottom: 24px; text-transform: uppercase; letter-spacing: -0.5px;">Expedition Roadmap</h3>
                    ${payload.itinerary.dailyBreakdown.map((day: any) => `
                        <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                            <div style="width: 40px; height: 40px; background: #1a1a1a; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; flex-shrink: 0;">${day.day || day.Day}</div>
                            <div style="padding-top: 10px; font-size: 14px; color: #555555; line-height: 1.6;">${day.description || day.Description || day.Activity || 'Activity details being finalized...'}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${portalUrl}" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 20px 36px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">${btnText || 'Access Terminal'}</a>
                </div>

                ${status === 'confirmed' ? `
                <div style="margin-top: 40px; padding-top: 35px; border-top: 2px solid #f0f0f0;">
                    <h3 style="font-size: 20px; font-weight: 900; color: #1a1a1a; margin-bottom: 24px; text-transform: uppercase; letter-spacing: -0.5px;">Essential Expedition Checklist</h3>
                    <p style="font-size: 14px; color: #666666; font-style: italic; margin-bottom: 25px;">To ensure your journey is as comfortable and seamless as possible, we have put together this essential guide on health, security, and packing. Please take a few moments to review these precautions before you fly.</p>
                    
                    <div style="background: #fdfaf0; border-radius: 20px; padding: 28px; margin-bottom: 20px; border: 1px solid #f2e6c4;">
                        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 900; color: ${accentColor}; text-transform: uppercase; letter-spacing: 1px;">1. Health & Vaccinations</h4>
                        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                            <li style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 10px;"><b style="color: #1a1a1a;">Malaria Prevention:</b> Tanzania is a malaria-risk area. We strongly recommend consulting your doctor for anti-malarial prophylaxis before departure.</li>
                            <li style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 10px;"><b style="color: #1a1a1a;">Vaccinations:</b> Ensure routine vaccines (Hepatitis A/B, Typhoid) are up to date. A Yellow Fever Certificate is mandatory if you are arriving from an endemic country.</li>
                            <li style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 10px;"><b style="color: #1a1a1a;">Hydration:</b> Only drink bottled or filtered water. Avoid tap water, even for brushing your teeth.</li>
                        </ul>
                    </div>
                </div>
                ` : ''}

                <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eeeeee;">
                    <div style="font-size: 10px; font-weight: 900; color: #bbbbbb; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Expedition Strategist</div>
                    <div style="width: 64px; height: 64px; background: #1a1a1a; border-radius: 16px; display: inline-block; text-align: center; vertical-align: middle; padding: 10px; border: 1.5px solid ${accentColor}; box-sizing: border-box; margin-right: 15px;">
                        <img src="${markImg}" style="width: 100%; height: 100%; object-fit: contain; display: block; margin: 0 auto;" alt="AY" />
                    </div>
                    <div style="display: inline-block; vertical-align: middle;">
                        <span style="display: block; font-size: 14px; font-weight: 900; color: #1a1a1a;">Asili Yetu Command</span>
                        <span style="display: block; font-size: 10px; font-weight: 800; color: #D4AF37; text-transform: uppercase;">Lead Signal Terminal</span>
                        <span style="display: block; font-size: 9px; font-weight: 700; color: #999; margin-top: 4px;">Registered BRELA Firm</span>
                    </div>
                </div>
            </div>
            <div style="padding: 40px; text-align: center; background: #fdfdfd; font-size: 11px; color: #cccccc; letter-spacing: 1px;">
                AUTHENTIC • PRIVATE • VISIONARY<br>
                &copy; 2026 Asili Yetu Safaris
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Acknowledgment email for the client
 */
export const getAcknowledgmentEmailHtml = (payload: any, locale: string = 'en') => {
    return safariEmailTemplate(
        payload.name || 'Explorer',
        payload.itinerary?.recommendedTitle || 'Custom Safari Expedition',
        'inquiry_received',
        undefined,
        payload.access_token,
        locale,
        undefined,
        payload
    );
};

/**
 * Detailed notification for the Admin
 */
export const getAdminNotificationHtml = (payload: any) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${bgColor}; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #eeeeee;">
            <div style="background: #1a1a1a; padding: 40px; text-align: left; border-bottom: 4px solid ${accentColor};">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; font-style: italic;">Expedition Intercept</h1>
                <p style="color: ${accentColor}; margin: 5px 0 0 0; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">New Intelligence Received</p>
            </div>
            <div style="padding: 40px;">
                <div style="margin-bottom: 30px;">
                    <div style="padding: 15px; background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0; margin-bottom: 15px;">
                        <span style="font-size: 9px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Explorer Identification</span>
                        <span style="font-size: 14px; font-weight: 700; color: #1a1a1a;">${payload.name} (${payload.email})</span>
                    </div>
                    <div style="padding: 15px; background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0; margin-bottom: 15px;">
                        <span style="font-size: 9px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Communication Link</span>
                        <span style="font-size: 14px; font-weight: 700; color: #1a1a1a;">${payload.phone || 'No direct signal'}</span>
                    </div>
                    <div style="padding: 15px; background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0;">
                        <span style="font-size: 9px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Selected Masterpiece</span>
                        <span style="font-size: 14px; font-weight: 700; color: #1a1a1a;">${payload.itinerary?.recommendedTitle || 'Custom Configuration'}</span>
                    </div>
                </div>

                <div style="background: #1a1a1a; color: #ffffff; border-radius: 20px; padding: 30px; margin: 30px 0; position: relative;">
                    <h4 style="margin: 0 0 10px 0; font-size: 10px; font-weight: 900; color: ${accentColor}; text-transform: uppercase; letter-spacing: 2px;">Concierge Strategy</h4>
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; font-style: italic; color: #e0e0e0;">"${payload.itinerary?.strategy || payload.itinerary?.rationale || 'Awaiting manual strategy deployment.'}"</p>
                </div>

                ${payload.itinerary?.dailyBreakdown ? `
                <div style="margin-top: 30px;">
                    <h4 style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: #1a1a1a;">Operational Breakdown</h4>
                    ${payload.itinerary.dailyBreakdown.map((day: any) => `
                        <div style="padding: 15px 0; border-bottom: 1px solid #eee;">
                            <span style="font-weight: 900; color: ${accentColor}; font-size: 13px; margin-right: 10px;">Day ${day.day || day.Day}</span>
                            <span style="font-size: 13px; color: #555; line-height: 1.5;">${day.description || day.Description || day.Activity}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            <div style="padding: 30px; text-align: center; background: #fdfdfd; font-size: 10px; color: #bbb; border-top: 1px solid #f5f5f5;">
                DISPATCHED FROM ASILI YETU COMMAND CENTER • &copy; 2026
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * High-fidelity Error Report for Admin
 */
export const getReportErrorEmailHtml = (payload: { message: string, digest?: string, url?: string }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: #111111; border-radius: 24px; overflow: hidden; border: 1px solid #222;">
            <div style="background: #ef4444; padding: 40px; text-align: left;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; font-style: italic;">Critical Signal Loss</h1>
                <p style="color: #ffcccc; margin: 5px 0 0 0; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">Sentinel Intelligence Report</p>
            </div>
            <div style="padding: 40px; color: #ffffff;">
                <div style="margin-bottom: 15px;">
                    <span style="font-size: 10px; font-weight: 900; color: #444; text-transform: uppercase; display: block; margin-bottom: 4px;">Incident Location</span>
                    <span style="color: #888; font-size: 12px;">${payload.url || 'Unknown Vector'}</span>
                </div>
                
                <div style="background: #000000; border-radius: 16px; padding: 25px; border: 1px solid #333; margin-bottom: 20px; font-family: monospace;">
                    <span style="font-size: 10px; font-weight: 900; color: #666; text-transform: uppercase; display: block; margin-bottom: 8px;">Payload Intercept</span>
                    <div style="color: #ef4444; font-size: 13px; line-height: 1.5; word-break: break-all;">${payload.message}</div>
                </div>

                <div style="margin-bottom: 15px;">
                    <span style="font-size: 10px; font-weight: 900; color: #444; text-transform: uppercase; display: block; margin-bottom: 4px;">Digital Digest</span>
                    <span style="color: #888; font-size: 12px;">${payload.digest || 'No digest available'}</span>
                </div>
            </div>
            <div style="padding: 30px; text-align: center; font-size: 10px; color: #444; border-top: 1px solid #1a1a1a;">
                SENTINEL AUTOMATED SURVEILLANCE • ASILI YETU COMMAND
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getInvoiceEmailHtml = (clientName: string, itineraryTitle: string, price: number, siteUrl: string, accessToken?: string, locale: string = 'en', payload?: any) => {
    return safariEmailTemplate(
        clientName,
        itineraryTitle,
        'invoice_generated',
        `Your personalized safari expedition is ready for final authorization. We have finalized the strategy and secured the logistics. The total quoted price for this private voyage is <b>$${price.toLocaleString()} USD</b>. You can review the full breakdown and secure your dates via the terminal below.`,
        accessToken,
        locale,
        undefined,
        payload
    );
};
