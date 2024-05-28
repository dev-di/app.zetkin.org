import { FC } from 'react';
import { Box, Button, FormControl, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from '../l10n/messageIds';
import { PotentialDuplicate } from '../store';
import useDuplicatesMutations from '../hooks/useDuplicatesMutations';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

interface DuplicatesModalListProps {
  duplicate: PotentialDuplicate;
}

const DuplicatesModalList: FC<DuplicatesModalListProps> = ({ duplicate }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { removeDuplicatePerson } = useDuplicatesMutations(orgId);
  const rows: ZetkinPerson[] = duplicate?.duplicates || [];

  const columns: GridColDef[] = [
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'Name',
      headerName: messages.modal.possibleDuplicatesColumns.name(),
      minWidth: 250,
      renderCell: (params) => (
        <ZUIPersonHoverCard personId={params.row.id}>
          <ZUIPersonAvatar orgId={orgId} personId={params.row.id} />
          <Typography
            sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
          >
            {params.row.first_name + ' ' + params.row.last_name}
          </Typography>
        </ZUIPersonHoverCard>
      ),
      sortable: false,
    },
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'E-Mail',
      headerName: messages.modal.possibleDuplicatesColumns.email(),
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
        >
          {params.row.email}
        </Typography>
      ),
      sortable: false,
    },
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'phone',
      headerName: messages.modal.possibleDuplicatesColumns.phone(),
      renderCell: (params) => (
        <Typography
          sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
        >
          {params.row.phone}
        </Typography>
      ),
      sortable: false,
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'button',
      headerName: '',
      minWidth: 150,
      renderCell: (params) => {
        return (
          <FormControl
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={() => removeDuplicatePerson(duplicate.id, params.row)}
              size="small"
              variant="outlined"
            >
              {messages.modal.notDuplicateButton()}
            </Button>
          </FormControl>
        );
      },
      sortable: false,
    },
  ];

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
      <Typography variant="h6">{messages.modal.peopleToMerge()}</Typography>

      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        rows={rows}
      />
    </Box>
  );
};

export default DuplicatesModalList;
