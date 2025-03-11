/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EmailInterface } from 'src/integrations/emails/emails.interface';
import { EmailsService } from 'src/integrations/emails/services/emails/emails.service';
import { resetPasswordTemplate } from 'src/integrations/emails/templates/auth/reset-password.template';
import { PdfService } from 'src/integrations/file-manager/services/pdf/pdf.service';

import { RtdbService } from 'src/integrations/firebase/services/rtdb/rtdb.service';
import { generateUniqueId, getCollectionWithorganizationId } from 'src/database/database.functions';
import { DatabaseCollectionEnums } from 'src/database/database.interface';
import { DatabaseService } from 'src/database/database.service';
import { resolveMultiplePromises } from 'src/shared/functions/promises.functions';
import { getEnumValues } from 'victor-dev-toolbox';

@Injectable()
export class MigrationsService {
  constructor(
    private rtdbService: RtdbService,
    private databaseService: DatabaseService,
    private emailService: EmailsService,
    private pdfService: PdfService
  ) { }

  async migrate() {
    const html = resetPasswordTemplate({ userName: 'Victor', resetPasswordLink: 'https://google.com' });
    const pdf = await this.pdfService.generatePDFFromHTML({ fileName: 'Name', html });
    return pdf;
    // const unverify = await this.unverifyUsers();
    // const organizations = await this.rtdbService.getAllItems(DatabaseCollectionEnums.ORGANIZATIONS);
    // organizations.forEach(async (organization) => {
    //   await this.migrateForOrganization(organization.id);
    // });

  }

  private async unverifyUsers() {
    const users = await this.databaseService.getAllItems({ collection: DatabaseCollectionEnums.USERS, organizationId: '' });
    const promises: any[] = [];
    users.forEach((user) => {
      promises.push(this.databaseService.updateItem({ id: user.id, collection: DatabaseCollectionEnums.USERS, organizationId: '', itemDto: { verified: false } }));
    });
    const resolve = await resolveMultiplePromises(promises);
  }

  async migrateForOrganization(organizationId: string) {

    const collections: DatabaseCollectionEnums[] = getEnumValues(DatabaseCollectionEnums);
    this.migrateOneTime();
    // const collections: DatabaseCollectionEnums[] = [DatabaseCollectionEnums.USERS, DatabaseCollectionEnums.PREGNANCIES];
    const collectionsToAvoid: DatabaseCollectionEnums[] = [
      DatabaseCollectionEnums.USERS,
      DatabaseCollectionEnums.ORGANIZATIONS,
      DatabaseCollectionEnums.DELETED_ORGANIZATIONS,
      DatabaseCollectionEnums.DELETED_USERS,
    ];
    const filteredCollections = collections.filter(
      (collection) => !collectionsToAvoid.includes(collection),
    );
    filteredCollections.forEach(async (collection) => {
      const modifiedCollection = this.collectionWithorganizationId(collection, organizationId);
      const items = await this.rtdbService.getAllItems(modifiedCollection);
      this.migrateForEachCollection(collection, organizationId);

    })
  }

  migrateOneTime() {
    const collectionsToAvoid: DatabaseCollectionEnums[] = [
      // DatabaseCollectionEnums.USERS,
      DatabaseCollectionEnums.ORGANIZATIONS,
      DatabaseCollectionEnums.DELETED_ORGANIZATIONS,
      DatabaseCollectionEnums.DELETED_USERS,
    ];
    collectionsToAvoid.forEach(c => {
      this.migrateForEachCollection(c, '');
    })
  }

  private async migrateForEachCollection(collection: DatabaseCollectionEnums, organizationId: string) {

    const modifiedCollection = this.collectionWithorganizationId(collection, organizationId);
    const items = await this.rtdbService.getAllItems(modifiedCollection);


    items.forEach(async (item) => {
      const id = item.id || generateUniqueId();
      item.id = id;
      const get = await this.databaseService.getItem({ collection, organizationId, id: item.id });
      if (get) { return } else {
        const create = await this.databaseService.createItem({ id, organizationId, collection, itemDto: item });
      }

    });

  }

  private testEmail() {
    const email: EmailInterface = {
      recipients: ['lancoladevelopers@gmail.com'],
      subject: 'test',
      html: `<!-- src/email/templates/welcome-email.html -->
<html>
  <body class="bg-gray-100">
    <div class="max-w-md mx-auto p-4 bg-white shadow-lg rounded-md">
      <h1 class="text-3xl font-semibold text-center text-gray-900">Welcome to Our Service!</h1>
      <p class="text-lg text-gray-700">Thank you for signing up.</p>
    </div>
  </body>
</html>
`,
      attachments: [],
    }
    this.emailService.sendEmail(email);
  }

  // migrateSingleItem(payload: { collection: DatabaseCollectionEnums, organizationId: string, itemId: any }) {
  //   const { collection, organizationId, itemId } = payload;
  //   const modifiedCollection = this.collectionWithorganizationId(collection, organizationId);
  //   const item = this.rtdbService.getItem(modifiedCollection, itemId);
  // }

  private collectionWithorganizationId(collection: DatabaseCollectionEnums, organizationId: string,) {
    const modifiedCollection = getCollectionWithorganizationId(collection, organizationId) as DatabaseCollectionEnums;
    return modifiedCollection;
  }
}
