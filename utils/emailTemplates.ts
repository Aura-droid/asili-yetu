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
    // Using high-fidelity public fallbacks for dev stability
    const bannerImg = `https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200`;
    
    const portalUrl = accessToken ? `${siteUrl}/${locale}/portal/${accessToken}` : siteUrl;

    const messageContent = customMessage || `The wilderness is calling. Your customized safari profile has been successfully initialized in our command center. Our concierge team has updated your safari status to: ${status.replace('_', ' ').toUpperCase()}.`;

    return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; background-color: ${bgColor}; margin: 0; padding: 0; }
            .content { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
            
            .banner-container { width: 100%; height: 260px; overflow: hidden; position: relative; background-color: #1a1a1a; }
            .banner-img { width: 100%; height: 100%; object-fit: cover; }
            
            .hero { padding: 40px; text-align: left; position: relative; z-index: 10; margin-top: -100px; }
            .hero h1 { color: #ffffff; margin: 0; font-size: 38px; font-weight: 900; letter-spacing: -2px; text-transform: uppercase; font-style: italic; text-shadow: 2px 2px 10px rgba(0,0,0,0.8); }
            .hero p { color: ${accentColor}; font-weight: 800; margin-top: 5px; letter-spacing: 3px; text-transform: uppercase; font-size: 11px; text-shadow: 1px 1px 4px rgba(0,0,0,0.8); }
            
            .body { padding: 40px; padding-top: 20px; }
            .body h2 { color: #1a1a1a; font-size: 24px; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.5px; }
            .body p { color: #555555; line-height: 1.7; font-size: 15px; margin-bottom: 25px; }
            
            .package-box { background: ${bgColor}; border-radius: 20px; padding: 28px; border-left: 6px solid ${accentColor}; margin: 35px 0; }
            .package-box span { font-size: 10px; font-weight: 900; color: #999999; text-transform: uppercase; display: block; margin-bottom: 6px; letter-spacing: 2px; }
            .package-box h3 { font-size: 20px; font-weight: 900; color: #1a1a1a; margin: 0; letter-spacing: -0.5px; }
            
            .btn { display: inline-block; background: #1a1a1a; color: #ffffff; padding: 20px 36px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; }
            
            .signature { margin-top: 50px; padding-top: 30px; border-top: 1px solid #eeeeee; }
            .sig-title { font-size: 10px; font-weight: 900; color: #bbbbbb; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
            
            /* High-Fidelity Branding */
            .logo-container { width: 64px; height: 64px; background: #1a1a1a; border-radius: 16px; display: inline-block; text-align: center; vertical-align: middle; padding: 10px; border: 1.5px solid ${accentColor}; box-sizing: border-box; }
            .logo-container img { width: 100%; height: 100%; object-fit: contain; display: block; margin: 0 auto; }
            
            .roadmap-container { margin-top: 40px; padding-top: 35px; border-top: 2px solid #f0f0f0; }
            .roadmap-container h3 { font-size: 20px; font-weight: 900; color: #1a1a1a; margin-bottom: 24px; text-transform: uppercase; letter-spacing: -0.5px; }
            .day-card { display: flex; gap: 20px; margin-bottom: 25px; }
            .day-num { width: 40px; height: 40px; background: #1a1a1a; color: #ffffff; border-radius: 50%; display: flex; items-center; justify-center; font-weight: 900; font-size: 14px; flex-shrink: 0; }
            .day-desc { padding-top: 10px; font-size: 14px; color: #555555; line-height: 1.6; }

            .footer { padding: 40px; text-align: center; background: #fdfdfd; font-size: 11px; color: #cccccc; letter-spacing: 1px; }
        </style>
    </head>
    <body>
        <div class="content">
            <div class="banner-container">
                <img src="${bannerImg}" class="banner-img" alt="Asili Yetu Safari" />
            </div>
            <div class="hero">
                <h1>Asili Yetu</h1>
                <p>Private Safaris & Expeditions</p>
            </div>
            <div class="body">
                <h2>Jambo, ${clientName}!</h2>
                <p>${messageContent}</p>
                
                <div class="package-box">
                    <span>Active Expedition Suggestion</span>
                    <h3>${itineraryTitle}</h3>
                </div>

                ${payload?.itinerary?.dailyBreakdown ? `
                <div class="roadmap-container">
                    <h3>Expedition Roadmap</h3>
                    ${payload.itinerary.dailyBreakdown.map((day: any) => `
                        <div class="day-card">
                            <div class="day-num">${day.day || day.Day}</div>
                            <div class="day-desc">${day.description || day.Description || day.Activity || 'Activity details being finalized...'}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <div style="text-align: center; margin-top: 40px;">
                    <a href="${portalUrl}" class="btn">${btnText || 'Access Terminal'}</a>
                </div>

                ${status === 'confirmed' ? `
                <div class="roadmap-container">
                    <h3>Essential Expedition Checklist</h3>
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

                <div class="signature">
                    <div class="sig-title">Expedition Strategist</div>
                    <div class="logo-container" style="margin-right: 15px;">
                        <img src="${markImg}" alt="AY" />
                    </div>
                    <div style="display: inline-block; vertical-align: middle;">
                        <span style="display: block; font-size: 14px; font-weight: 900; color: #1a1a1a;">Asili Yetu Command</span>
                        <span style="display: block; font-size: 10px; font-weight: 800; color: #D4AF37; text-transform: uppercase;">Lead Signal Terminal</span>
                        <span style="display: block; font-size: 9px; font-weight: 700; color: #999; margin-top: 4px;">Registered BRELA Firm</span>
                    </div>
                </div>
            </div>
            <div class="footer">
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
    <div style="font-family: sans-serif; padding: 40px; color: #1a1a1a; background: #f9f9f9;">
        <h1 style="text-transform: uppercase; letter-spacing: -1px; font-style: italic;">New Expedition Request</h1>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p><strong>Explorer:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Phone:</strong> ${payload.phone || 'Not provided'}</p>
        <p><strong>Itinerary:</strong> ${payload.itinerary?.recommendedTitle || 'Custom'}</p>
        <p><strong>Special Requests:</strong> ${payload.dietary || 'None'}</p>
        <p><strong>Add-ons:</strong> ${payload.addons?.join(', ') || 'None'}</p>
        
        <div style="margin-top: 30px; padding: 20px; background: #ffffff; border-left: 4px solid ${accentColor}; border-radius: 8px;">
            <h4 style="margin-top: 0; text-transform: uppercase; font-size: 10px; color: ${accentColor};">Expedition Strategy</h4>
            <p style="margin-bottom: 20px; font-style: italic;">"${payload.itinerary?.strategy || payload.itinerary?.rationale || 'No automated strategy provided.'}"</p>
            
            <h4 style="text-transform: uppercase; font-size: 10px; color: #1a1a1a; margin-bottom: 10px;">Daily Breakdown</h4>
            <div style="font-size: 12px; line-height: 1.6;">
                ${payload.itinerary?.dailyBreakdown?.map((day: any) => `
                    <div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                        <b style="color: ${accentColor};">Day ${day.day || day.Day}:</b> ${day.description || day.Description || day.Activity}
                    </div>
                `).join('') || '<p>Detailed breakdown pending.</p>'}
            </div>
        </div>

        <p style="margin-top: 40px; font-size: 10px; color: #999;">Sent from Asili Yetu Command Center.</p>
        
        <div style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; display: flex; align-items: center; gap: 12px;">
            <img src="${logoImg}" alt="Logo" style="width: 32px; border-radius: 6px;" />
            <div>
                <p style="margin: 0; font-size: 12px; font-weight: bold;">Asili Yetu CRM</p>
                <p style="margin: 0; font-size: 10px; color: ${accentColor}; text-transform: uppercase;">Automated Dispatch System</p>
            </div>
        </div>
    </div>
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
