import { Request, Response } from 'express';
import db from '../config/database';
import { siteSettings } from '../db/schema';
import type { NewSiteSetting } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

// Get all site settings (admin)
export const getSiteSettings = async (req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(siteSettings)
      .orderBy(desc(siteSettings.updated_at));

    // Convert to key-value object for easier frontend consumption
    const settings = data.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        type: setting.type,
        description: setting.description,
        updated_at: setting.updated_at,
      };
      return acc;
    }, {} as Record<string, any>);

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch site settings' });
  }
};

// Get specific setting by key (public/admin)
export const getSettingByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const [data] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (!data) {
      return res.status(404).json({ success: false, error: 'Setting not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch setting' });
  }
};

// Create or update site setting (admin)
export const upsertSiteSetting = async (req: Request, res: Response) => {
  try {
    const { key, value, type, description } = req.body;

    // Check if setting exists
    const [existingSetting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    let data;

    if (existingSetting) {
      // Update existing setting
      [data] = await db
        .update(siteSettings)
        .set({
          value,
          type: type || existingSetting.type,
          description: description || existingSetting.description,
          updated_at: new Date(),
        })
        .where(eq(siteSettings.key, key))
        .returning();
    } else {
      // Create new setting
      const newSetting: NewSiteSetting = {
        key,
        value,
        type: type || 'text',
        description,
      };

      [data] = await db
        .insert(siteSettings)
        .values(newSetting)
        .returning();
    }

    res.json({ 
      success: true, 
      data, 
      message: existingSetting ? 'Setting updated successfully' : 'Setting created successfully' 
    });
  } catch (error) {
    console.error('Error upserting site setting:', error);
    res.status(500).json({ success: false, error: 'Failed to save setting' });
  }
};

// Batch update multiple settings (admin)
export const batchUpdateSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings)) {
      return res.status(400).json({ success: false, error: 'Settings must be an array' });
    }

    const updatedSettings = [];

    for (const setting of settings) {
      const { key, value, type, description } = setting;

      // Check if setting exists
      const [existingSetting] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      let data;

      if (existingSetting) {
        // Update existing setting
        [data] = await db
          .update(siteSettings)
          .set({
            value,
            type: type || existingSetting.type,
            description: description || existingSetting.description,
            updated_at: new Date(),
          })
          .where(eq(siteSettings.key, key))
          .returning();
      } else {
        // Create new setting
        const newSetting: NewSiteSetting = {
          key,
          value,
          type: type || 'text',
          description,
        };

        [data] = await db
          .insert(siteSettings)
          .values(newSetting)
          .returning();
      }

      updatedSettings.push(data);
    }

    res.json({ 
      success: true, 
      data: updatedSettings, 
      message: `${updatedSettings.length} setting(s) updated successfully` 
    });
  } catch (error) {
    console.error('Error batch updating settings:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
};

// Delete site setting (admin)
export const deleteSiteSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const [deletedSetting] = await db
      .delete(siteSettings)
      .where(eq(siteSettings.key, key))
      .returning({ key: siteSettings.key });

    if (!deletedSetting) {
      return res.status(404).json({ success: false, error: 'Setting not found' });
    }

    res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ success: false, error: 'Failed to delete setting' });
  }
};

// Get public settings (for frontend)
export const getPublicSettings = async (req: Request, res: Response) => {
  try {
    // Define which settings are public
    const publicKeys = [
      'site_title',
      'site_description',
      'site_logo',
      'contact_email',
      'contact_phone',
      'social_facebook',
      'social_instagram',
      'social_twitter',
      'social_youtube',
      'about_text',
      'footer_text',
      'hero_title',
      'hero_subtitle',
      'hero_image',
    ];

    const data = await db
      .select()
      .from(siteSettings);
    
    // Filter only public settings
    const publicSettings = data
      .filter(setting => publicKeys.includes(setting.key))
      .reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

    res.json({ success: true, data: publicSettings });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch public settings' });
  }
};
